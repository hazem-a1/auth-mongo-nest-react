module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/*.dto.ts',
        '!**/*.enum.ts',
        '!**/*.schema.ts',
        '!**/*.types.ts',
        '!**/main.ts',
        '!**/index.ts',
        '!**/test/**',
        '!**/node_modules/**',
    ],
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['frontend/'],
    modulePathIgnorePatterns: ['frontend/'],
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    testTimeout: 30000,
    verbose: true,
    clearMocks: true,
    restoreMocks: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/test/',
        '/dist/',
        '/coverage/',
        '.*\\.dto\\.ts$',
        '.*\\.enum\\.ts$',
        '.*\\.schema\\.ts$',
        '.*\\.types\\.ts$',
        'main\\.ts$',
        'index\\.ts$',
    ],

}; 