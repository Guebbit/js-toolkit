/**
 * Per-file mutation baseline gate.
 *
 * A single global percentage is not a gate: one thoroughly tested file carries
 * a weak one, and a file can rot all the way down while the headline number
 * holds. So the baseline is per file, and every file is checked on its own.
 *
 * Two scores are tracked per file, because they mean different things and call
 * for different work:
 *
 *   covered  killed / (killed + survived)          — of the mutants a test
 *                                                    actually executes, how many
 *                                                    does an assertion catch
 *   total    killed / (killed + survived + noCov)  — the same, counting mutants
 *                                                    no test reaches at all
 *
 * `total` far below `covered` means code nothing executes: write a test that
 * runs it. Both low and close together means tests run the code without
 * asserting on it: sharpen an assertion that already exists. Recording only one
 * number hides which of the two you are looking at.
 *
 * Direction of travel is one-way. A file that improves has its baseline rewritten
 * upward, so the gain is locked in. A file that drops fails the run and the
 * baseline is left alone — a regression must never be recordable as the new
 * normal, which is exactly what would happen if this script always wrote back
 * whatever it measured.
 *
 * Usage:
 *   node scripts/mutation-baseline.mjs           check, and raise improved files
 *   node scripts/mutation-baseline.mjs --init    write a baseline from scratch
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const reportPath = path.join(root, 'reports', 'mutation', 'mutation.json')
const baselinePath = path.join(root, 'mutation-baseline.json')

// Floating-point scores are compared with a small slack so a re-run that lands
// on the same mutants cannot fail on a rounding difference alone.
const EPSILON = 0.01

const initialising = process.argv.includes('--init')

if (!fs.existsSync(reportPath)) {
    console.error(`No mutation report at ${path.relative(root, reportPath)}.`)
    console.error('Run `npm run test:mutation` first.')
    process.exit(1)
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

// Killed and Timeout both mean the mutant did not survive. Ignored and
// CompileError mutants never ran and are excluded from both denominators, the
// same way Stryker's own score does it.
const scoreFile = (mutants) => {
    const count = (status) => mutants.filter((mutant) => mutant.status === status).length
    const killed = count('Killed') + count('Timeout')
    const survived = count('Survived')
    const noCoverage = count('NoCoverage')

    const detected = killed
    const coveredTotal = killed + survived
    const validTotal = killed + survived + noCoverage

    return {
        covered: coveredTotal === 0 ? 100 : (detected / coveredTotal) * 100,
        total: validTotal === 0 ? 100 : (detected / validTotal) * 100,
        killed,
        survived,
        noCoverage
    }
}

const measured = {}
for (const [file, data] of Object.entries(report.files ?? {})) {
    measured[path.relative(root, path.resolve(root, file)).replaceAll('\\', '/')] = scoreFile(
        data.mutants ?? []
    )
}

const round = (value) => Math.round(value * 100) / 100
const asBaseline = (entry, previous) => ({
    total: round(entry.total),
    covered: round(entry.covered),
    // A `note` is written by hand to record why a file sits below 100% on
    // purpose — an equivalent mutant that cannot be killed without asserting on
    // an implementation detail. It is carried across rewrites so the reason
    // survives the next --init.
    ...(previous?.note ? { note: previous.note } : {})
})

if (initialising) {
    const existing = fs.existsSync(baselinePath)
        ? JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
        : {}
    const baseline = Object.fromEntries(
        Object.entries(measured)
            .toSorted(([a], [b]) => a.localeCompare(b))
            .map(([file, entry]) => [file, asBaseline(entry, existing[file])])
    )
    fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 4)}\n`)
    console.log(`Wrote a baseline for ${Object.keys(baseline).length} files.`)
    process.exit(0)
}

if (!fs.existsSync(baselinePath)) {
    console.error(`No baseline at ${path.relative(root, baselinePath)}.`)
    console.error('Create one with `node scripts/mutation-baseline.mjs --init`.')
    process.exit(1)
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const regressions = []
const improvements = []
const added = []

for (const [file, entry] of Object.entries(measured)) {
    const previous = baseline[file]

    // A brand-new source file has no baseline yet; record where it starts rather
    // than letting it in ungated.
    if (!previous) {
        added.push(file)
        baseline[file] = asBaseline(entry)
        continue
    }

    for (const metric of ['total', 'covered']) {
        if (entry[metric] < previous[metric] - EPSILON) {
            regressions.push({
                file,
                metric,
                was: previous[metric],
                now: round(entry[metric]),
                survived: entry.survived,
                noCoverage: entry.noCoverage,
                note: previous.note
            })
        }
    }
}

// Only raise baselines when nothing regressed. Rewriting the improved half of a
// run that also broke something would quietly bank the good news and lose the
// bad, which is the failure mode this whole script exists to prevent.
if (regressions.length === 0) {
    for (const [file, entry] of Object.entries(measured)) {
        const previous = baseline[file]
        for (const metric of ['total', 'covered'])
            if (entry[metric] > previous[metric] + EPSILON) {
                improvements.push({
                    file,
                    metric,
                    was: previous[metric],
                    now: round(entry[metric])
                })
                previous[metric] = round(entry[metric])
            }
    }
}

// A source file that disappeared should not keep a baseline entry around.
for (const file of Object.keys(baseline)) if (!measured[file]) delete baseline[file]

if (added.length > 0) {
    console.log('New files, baseline recorded at their current score:')
    for (const file of added)
        console.log(
            `  ${file}  total ${round(measured[file].total)}%  covered ${round(measured[file].covered)}%`
        )
}

if (improvements.length > 0) {
    console.log('\nImproved, baseline raised:')
    for (const { file, metric, was, now } of improvements)
        console.log(`  ${file}  ${metric} ${was}% -> ${now}%`)
}

if (regressions.length > 0) {
    console.error('\nMutation score regressed:')
    for (const { file, metric, was, now, survived, noCoverage, note } of regressions) {
        console.error(`  ${file}  ${metric} ${was}% -> ${now}%`)
        console.error(
            noCoverage > 0
                ? `      ${noCoverage} mutant(s) no test reaches, ${survived} run but unasserted`
                : `      ${survived} mutant(s) run by a test but caught by no assertion`
        )
        if (note) console.error(`      recorded note: ${note}`)
    }
    console.error(
        '\nA file can also drop percentage points by getting smaller rather than' +
            '\nweaker: check whether the mutant count moved before touching a test.'
    )
    console.error('\nBaseline left unchanged. Fix the tests, do not lower the bar.')
    process.exit(1)
}

const sorted = Object.fromEntries(
    Object.entries(baseline).toSorted(([a], [b]) => a.localeCompare(b))
)
fs.writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 4)}\n`)

const files = Object.keys(measured).length
console.log(`\nAll ${files} files at or above their baseline.`)
