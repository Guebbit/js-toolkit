/**
 * Build ESM, CommonJS and declarations from one source tree.
 *
 * Node decides a file's module system from the nearest package.json `type`.
 * The root is `"type": "module"`, so the CommonJS output needs its own marker
 * file saying otherwise — without it Node parses dist/cjs/*.js as ESM and the
 * `require` half of the exports map fails at runtime.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const run = (arguments_) =>
    execFileSync('npx', arguments_, { cwd: root, stdio: 'inherit', encoding: 'utf8' })

fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true })

run(['tsc', '-p', 'tsconfig.build.esm.json'])
run(['tsc', '-p', 'tsconfig.build.cjs.json'])

fs.writeFileSync(
    path.join(root, 'dist', 'cjs', 'package.json'),
    `${JSON.stringify({ type: 'commonjs' }, undefined, 4)}\n`
)
fs.writeFileSync(
    path.join(root, 'dist', 'esm', 'package.json'),
    `${JSON.stringify({ type: 'module' }, undefined, 4)}\n`
)

console.log('built dist/esm and dist/cjs, each with its own declarations')
