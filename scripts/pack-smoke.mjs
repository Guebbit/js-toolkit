/**
 * Packaging smoke test.
 *
 * Builds a real tarball with `npm pack`, installs it into a throwaway directory
 * and imports it the two ways a consumer can: `require()` from CommonJS and
 * `import` from ESM. Then calls a function and checks the answer.
 *
 * This is the failure the unit suite cannot see. Jest resolves `../src` through
 * ts-jest and never touches `main`, `exports`, `files` or `dist`, so a wrong
 * entry point, a missing file in the published set, or an `exports` map that
 * hides the types all ship green.
 *
 * Named ESM imports are the sharp edge here: the package is CommonJS, so Node
 * has to statically detect the named exports out of the emitted
 * `Object.defineProperty(exports, ...)` getters. If the emit format ever
 * changes, `import { getDelta } from '@guebbit/js-toolkit'` throws
 * SyntaxError while `require()` keeps working.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

const run = (command, arguments_, cwd) =>
    execFileSync(command, arguments_, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'js-toolkit-pack-'))
let failures = 0
const check = (label, function_) => {
    try {
        function_()
        console.log(`  ok   ${label}`)
    } catch (error) {
        failures++
        console.error(`  FAIL ${label}\n       ${error.message.split('\n')[0]}`)
    }
}

try {
    console.log('building…')
    run('npm', ['run', 'build'], root)

    console.log('packing…')
    const tarball = run('npm', ['pack', '--pack-destination', temporary], root)
        .trim()
        .split('\n')
        .pop()
    const tarballPath = path.join(temporary, tarball)

    console.log('installing tarball into a clean directory…')
    fs.writeFileSync(
        path.join(temporary, 'package.json'),
        JSON.stringify({ name: 'pack-smoke', version: '1.0.0', private: true }, null, 2)
    )
    run('npm', ['install', '--no-audit', '--no-fund', tarballPath], temporary)

    const installed = path.join(temporary, 'node_modules', pkg.name)

    console.log('\nchecking the published file set:')
    check('dist/index.js is published', () => {
        if (!fs.existsSync(path.join(installed, 'dist', 'index.js')))
            throw new Error('dist/index.js missing from the tarball')
    })
    check('the type entry point is published', () => {
        const types = path.join(installed, pkg.types)
        if (!fs.existsSync(types)) throw new Error(`${pkg.types} missing from the tarball`)
    })
    // `tsc` never cleans its outDir, so a deleted source leaves its old .js
    // behind and `files: ["dist"]` happily publishes it. Dead modules in the
    // tarball are how a removed export keeps resolving for consumers.
    check('no module is published without a matching source', () => {
        const sources = new Set(
            fs
                .readdirSync(path.join(root, 'src'))
                .filter((name) => name.endsWith('.ts'))
                .map((name) => name.replace(/\.ts$/, ''))
        )
        const orphans = fs
            .readdirSync(path.join(installed, 'dist'))
            .filter((name) => name.endsWith('.js'))
            .map((name) => name.replace(/\.js$/, ''))
            .filter((name) => !sources.has(name))
        if (orphans.length > 0) throw new Error(`orphaned modules shipped: ${orphans.join(', ')}`)
    })

    console.log('\nimporting the installed package:')

    // CommonJS: default interop plus a named export off the barrel.
    fs.writeFileSync(
        path.join(temporary, 'consume.cjs'),
        `const toolkit = require(${JSON.stringify(pkg.name)})
const { getDelta } = require(${JSON.stringify(pkg.name)})
if (typeof getDelta !== 'function') throw new Error('getDelta is not a function')
const wrapped = getDelta(350, 10, 360)
if (wrapped !== 20) throw new Error('getDelta(350, 10, 360) === ' + wrapped + ', expected 20')
const names = Object.keys(toolkit)
if (names.length < 39) throw new Error('barrel exposes only ' + names.length + ' exports')
console.log('cjs:' + names.length)
`
    )
    check('require() resolves and calls a real function', () => {
        const out = run('node', ['consume.cjs'], temporary)
        if (!out.startsWith('cjs:')) throw new Error(`unexpected output: ${out}`)
    })

    // ESM: the named-import form, which needs Node to statically detect the
    // CommonJS named exports. A default-only import would pass even when this
    // is broken, so both are asserted.
    fs.writeFileSync(
        path.join(temporary, 'consume.mjs'),
        `import toolkit, { getDelta, getMapDistance } from ${JSON.stringify(pkg.name)}
if (typeof getDelta !== 'function') throw new Error('named import getDelta is not a function')
if (typeof toolkit.getDelta !== 'function') throw new Error('default import has no getDelta')
const distance = getMapDistance(0, 3, 0, 4)
if (distance !== 5) throw new Error('getMapDistance(0, 3, 0, 4) === ' + distance + ', expected 5')
console.log('esm:ok')
`
    )
    check('import { ... } resolves and calls a real function', () => {
        const out = run('node', ['consume.mjs'], temporary)
        if (!out.includes('esm:ok')) throw new Error(`unexpected output: ${out}`)
    })

    // The types have to survive the `exports` map too: a map without a "types"
    // condition resolves at runtime and leaves TypeScript consumers on `any`
    // under moduleResolution node16/bundler.
    fs.writeFileSync(
        path.join(temporary, 'consume.ts'),
        `import { getDelta, type ISetCookieOptions } from ${JSON.stringify(pkg.name)}
const options: ISetCookieOptions = { days: 1 }
export const value: number = getDelta(350, 10, 360)
export const path_: string | undefined = options.path
`
    )
    fs.writeFileSync(
        path.join(temporary, 'tsconfig.json'),
        JSON.stringify(
            {
                compilerOptions: {
                    strict: true,
                    noEmit: true,
                    target: 'es2022',
                    module: 'node16',
                    moduleResolution: 'node16',
                    lib: ['dom', 'esnext'],
                    types: []
                },
                files: ['consume.ts']
            },
            null,
            2
        )
    )
    check('the published types resolve under moduleResolution node16', () => {
        run('node', [path.join(root, 'node_modules', 'typescript', 'bin', 'tsc')], temporary)
    })
} finally {
    fs.rmSync(temporary, { recursive: true, force: true })
}

if (failures > 0) {
    console.error(`\n${failures} packaging check(s) failed`)
    process.exit(1)
}
console.log('\nall packaging checks passed')
