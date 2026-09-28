/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    // src/ is a root for the import graph, not for tests (testMatch below finds
    // those). --findRelatedTests, which Stryker runs for every mutant, can only
    // trace imports through files inside a root. Stryker adds just the mutated
    // file's own folder, so a file in src/internal/ would find no tests: the
    // helpers that import it sit one level up.
    roots: ['<rootDir>/tests', '<rootDir>/src'],
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
