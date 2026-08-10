export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    // setup.ts holds configuration, not tests
    testPathIgnorePatterns: ['<rootDir>/tests/setup.ts']
}
