export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    moduleNameMapper: {
        '^@$': '<rootDir>/src',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@unikue/ts-multi-map$': '<rootDir>/src'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: './tsconfig.test.json'
        }]
    }
};
