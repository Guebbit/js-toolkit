#!/usr/bin/env node
/**
 * Guards the published `.d.ts` files against ways they can quietly stop
 * resolving, or leak something not meant to be public, for a consumer.
 *
 * This package has no optional peers — the checks vue-toolkit's own dtsGuard
 * runs for `zod` and `@vue/reactivity` don't apply here. What does apply:
 *
 *  - the ESM and CommonJS declaration trees must describe the same modules,
 *    since `exports` promises both, and a build that only emits one silently
 *    breaks the other format for every consumer;
 *  - no `.d.ts` may import a `node:` builtin except `deleteFile`'s — a
 *    browser consumer with no `@types/node` installed must still type-check
 *    against everything else in the package;
 *  - no `.d.ts` may import `internal/` — see CLAUDE.md, "Function design".
 *    Dormant today: `src/internal/` does not exist yet, so this never
 *    matches, but the check stays on so the first file added there is caught
 *    immediately rather than found later.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const dtsFiles = async (buildDirectory) => {
    const entries = await readdir(buildDirectory, { withFileTypes: true, recursive: true })
    return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.d.ts'))
        .map((entry) => path.relative(buildDirectory, path.join(entry.parentPath, entry.name)))
        .sort()
}

const esmRoot = path.join(root, 'dist', 'esm')
const cjsRoot = path.join(root, 'dist', 'cjs')
const [esmDts, cjsDts] = await Promise.all([dtsFiles(esmRoot), dtsFiles(cjsRoot)])

const failures = []

// The one module allowed to import a node: builtin — it is Node-only source
// (see README, "Browser and Node").
const NODE_IMPORT_ALLOWED = new Set(['deleteFile.d.ts'])
const NODE_IMPORT = /\bfrom ['"]node:|import\(['"]node:/
const INTERNAL_IMPORT = /\bfrom ['"][.\w/]*\/internal\/|import\(['"][.\w/]*\/internal\//

const missingFromCjs = esmDts.filter((file) => !cjsDts.includes(file))
const missingFromEsm = cjsDts.filter((file) => !esmDts.includes(file))
if (missingFromCjs.length > 0 || missingFromEsm.length > 0) {
    if (missingFromCjs.length > 0)
        failures.push(`in dist/esm but not dist/cjs: ${missingFromCjs.join(', ')}`)
    if (missingFromEsm.length > 0)
        failures.push(`in dist/cjs but not dist/esm: ${missingFromEsm.join(', ')}`)
}

for (const [buildName, buildRoot, files] of [
    ['esm', esmRoot, esmDts],
    ['cjs', cjsRoot, cjsDts]
])
    for (const file of files) {
        const content = await readFile(path.join(buildRoot, file), 'utf8')
        if (NODE_IMPORT.test(content) && !NODE_IMPORT_ALLOWED.has(path.basename(file)))
            failures.push(`dist/${buildName}/${file} imports a node: builtin`)
        if (INTERNAL_IMPORT.test(content))
            failures.push(`dist/${buildName}/${file} imports internal/, which is not public API`)
    }

if (failures.length > 0) {
    console.error('tests/package/dtsGuard.mjs: forbidden reference(s) in the published types:')
    for (const failure of failures) console.error(`  ${failure}`)
    process.exit(1)
}

console.log(
    `tests/package/dtsGuard.mjs: OK — ${esmDts.length} declaration files match across esm/cjs, no forbidden references`
)
