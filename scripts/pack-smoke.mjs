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
 * The dual build is the sharp edge: the root package is `type: module`, so the
 * CommonJS output only parses as CommonJS because of a marker package.json
 * written into dist/cjs. Lose that file and `require()` fails at runtime while
 * every unit test stays green. The subpath exports are checked too, since a
 * wildcard that does not line up with the emitted layout only shows up here.
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
        // stdout/stderr of the failing child, not just the exec wrapper's
        // one-line summary, or the real cause never reaches the log
        const detail = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim()
        console.error(
            `  FAIL ${label}\n${detail
                .split('\n')
                .map((line) => `       ${line}`)
                .join('\n')}`
        )
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
    check('both builds and the types are published', () => {
        for (const relative of [
            'dist/esm/index.js',
            'dist/esm/index.d.ts',
            'dist/cjs/index.js',
            'dist/cjs/index.d.ts',
            pkg.types
        ])
            if (!fs.existsSync(path.join(installed, relative)))
                throw new Error(`${relative} missing from the tarball`)
    })
    // Without this marker Node reads dist/cjs/*.js as ESM, because the root
    // package.json says `type: module`, and require() dies on `exports`.
    check('the CommonJS build is marked as CommonJS', () => {
        const marker = path.join(installed, 'dist', 'cjs', 'package.json')
        if (!fs.existsSync(marker)) throw new Error('dist/cjs/package.json missing')
        const type = JSON.parse(fs.readFileSync(marker, 'utf8')).type
        if (type !== 'commonjs') throw new Error(`dist/cjs/package.json type is ${type}`)
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
            .readdirSync(path.join(installed, 'dist', 'esm'))
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
if (names.length !== 37) throw new Error('barrel exposes ' + names.length + ' exports, expected 37')
const subpath = require(${JSON.stringify(pkg.name)} + '/getDelta').default
if (typeof subpath !== 'function') throw new Error('subpath require did not resolve')
if (subpath(350, 10, 360) !== 20) throw new Error('subpath getDelta returned the wrong value')
console.log('cjs:' + names.length)
`
    )
    check('require() resolves and calls a real function', () => {
        const out = run('node', ['consume.cjs'], temporary)
        if (!out.startsWith('cjs:')) throw new Error(`unexpected output: ${out}`)
    })

    // ESM: named imports and the namespace form. There is deliberately no
    // default export — the barrel exports names, and a default would only exist
    // as a CommonJS-interop artifact.
    fs.writeFileSync(
        path.join(temporary, 'consume.mjs'),
        `import * as toolkit from ${JSON.stringify(pkg.name)}
import { getDelta, getMapDistance } from ${JSON.stringify(pkg.name)}
if (typeof getDelta !== 'function') throw new Error('named import getDelta is not a function')
if (typeof toolkit.getDelta !== 'function') throw new Error('namespace import has no getDelta')
if ('default' in toolkit) throw new Error('the barrel should not have a default export')
const distance = getMapDistance(0, 3, 0, 4)
if (distance !== 5) throw new Error('getMapDistance(0, 3, 0, 4) === ' + distance + ', expected 5')
const { default: subpath } = await import(${JSON.stringify(pkg.name)} + '/getDelta')
if (typeof subpath !== 'function') throw new Error('subpath import did not resolve')
if (subpath(350, 10, 360) !== 20) throw new Error('subpath getDelta returned the wrong value')
console.log('esm:ok')
`
    )
    check('import { ... } resolves and calls a real function', () => {
        const out = run('node', ['consume.mjs'], temporary)
        if (!out.includes('esm:ok')) throw new Error(`unexpected output: ${out}`)
    })

    // Types have to resolve for both kinds of consumer. With `type: module` at
    // the root and one shared declaration folder, TypeScript reads every .d.ts
    // as ESM and a CommonJS consumer cannot import the package at all — which
    // is why the declarations are emitted per format and the `types` condition
    // sits inside `import`/`require`.
    const consumerSource = `import { getDelta, type ISetCookieOptions } from ${JSON.stringify(pkg.name)}
import subpathDelta from ${JSON.stringify(pkg.name + '/getDelta')}
const options: ISetCookieOptions = { days: 1 }
export const value: number = getDelta(350, 10, 360)
export const viaSubpath: number = subpathDelta(350, 10, 360)
export const path_: string | undefined = options.path
`

    const typecheckAs = (label, moduleType) => {
        const directory = path.join(temporary, `types-${moduleType}`)
        fs.mkdirSync(directory, { recursive: true })
        fs.writeFileSync(
            path.join(directory, 'package.json'),
            JSON.stringify({ name: `types-${moduleType}`, version: '1.0.0', type: moduleType })
        )
        fs.writeFileSync(path.join(directory, 'consume.ts'), consumerSource)
        fs.writeFileSync(
            path.join(directory, 'tsconfig.json'),
            JSON.stringify({
                compilerOptions: {
                    strict: true,
                    noEmit: true,
                    target: 'es2022',
                    module: 'node16',
                    moduleResolution: 'node16',
                    lib: ['dom', 'esnext'],
                    // No baseUrl/paths: a path mapping would resolve the package
                    // directly and skip the exports map, which is the thing under
                    // test. The symlinked node_modules below is what makes normal
                    // node16 resolution work from this directory.
                    types: []
                },
                files: ['consume.ts']
            })
        )
        fs.symlinkSync(
            path.join(temporary, 'node_modules'),
            path.join(directory, 'node_modules'),
            'dir'
        )
        check(label, () => {
            run('node', [path.join(root, 'node_modules', 'typescript', 'bin', 'tsc')], directory)
        })
    }

    typecheckAs('the published types resolve for an ESM consumer', 'module')
    typecheckAs('the published types resolve for a CommonJS consumer', 'commonjs')
} finally {
    fs.rmSync(temporary, { recursive: true, force: true })
}

if (failures > 0) {
    console.error(`\n${failures} packaging check(s) failed`)
    process.exit(1)
}
console.log('\nall packaging checks passed')
