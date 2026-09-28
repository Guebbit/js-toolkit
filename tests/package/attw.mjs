#!/usr/bin/env node
/**
 * Are the Types Wrong, run twice, because one invocation cannot cover this
 * package's shape.
 *
 * `attw --pack .` with its default (strict) profile auto-detects entry
 * points, but it only finds the main import and `package.json` — it lists a
 * wildcard subpath export (`./*`) as `(wildcard)` and never checks it. So the
 * 46 subpaths this package publishes (`@guebbit/js-toolkit/getCookie` and
 * every other helper) go unchecked unless they are named explicitly.
 *
 * Naming them explicitly needs `--profile node16`: under `node10`,
 * `moduleResolution: "node"` ignores `exports` entirely and looks for
 * `dist/getCookie.d.ts` at the package root, which does not exist — every
 * subpath fails there regardless of how correct the `exports` map is.
 * A `typesVersions` fallback was tried and rejected (see the docs) — it fixes
 * the subpaths under node10 but breaks the main import and `package.json`
 * under node10 in exchange, so subpath imports are documented as
 * unsupported under node10 instead.
 *
 * So: run 1 checks the main entry point under every resolution mode,
 * including node10, since that one still works. Run 2 checks every subpath,
 * but only under node16 (CJS and ESM) and bundler — not node10.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const exportNames = JSON.parse(
    fs.readFileSync(path.join(root, 'tests', 'package', 'exports.json'), 'utf8')
)

const runAttw = (label, arguments_) => {
    console.log(`\n${label}`)
    try {
        execFileSync('npx', ['attw', '--pack', '.', ...arguments_], {
            cwd: root,
            encoding: 'utf8',
            stdio: 'inherit'
        })
    } catch {
        // attw already printed its own report to stdout/stderr (stdio: 'inherit'
        // above) — the only thing left to do here is fail the run.
        process.exitCode = 1
    }
}

runAttw('main entry point, every resolution mode (including node10):', [])

runAttw('every subpath export, node16 (CJS + ESM) and bundler — node10 is not supported:', [
    '--profile',
    'node16',
    '--include-entrypoints',
    ...exportNames.map((name) => `./${name}`)
])

if (process.exitCode) {
    console.error('\ntests/package/attw.mjs: one or both attw runs reported a problem')
} else {
    console.log(
        `\ntests/package/attw.mjs: OK — main entry point and all ${exportNames.length} subpaths check out`
    )
}
