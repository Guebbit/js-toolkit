/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    // testMatch, not the default spec|test pattern: it keeps _helpers/ and
    // _setup/ (fixtures and configuration, not tests) out of the run without a
    // separate ignore list.
    testMatch: ['**/tests/**/*.spec.ts'],
    restoreMocks: true,
    // Configures fast-check (seed, numRuns) before any *.property.spec.ts imports it.
    setupFiles: ['<rootDir>/tests/_setup/fastCheck.ts'],
    moduleNameMapper: {
        // Source carries explicit .js specifiers so the ESM build works in Node.
        // Jest resolves them literally and would miss the .ts files, so the
        // extension is stripped back off here.
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
}
