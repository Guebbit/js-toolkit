export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    // setup.ts holds configuration, not tests
    testPathIgnorePatterns: ['<rootDir>/tests/setup.ts'],
    moduleNameMapper: {
        // Source carries explicit .js specifiers so the ESM build works in Node.
        // Jest resolves them literally and would miss the .ts files, so the
        // extension is stripped back off here.
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
}
