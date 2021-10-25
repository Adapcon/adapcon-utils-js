module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.test.ts'],
  roots: [
    '<rootDir>/src',
    '<rootDir>/__tests__'
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  setupFiles: ['dotenv/config'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  modulePathIgnorePatterns: ['<rootDir>/src/dao'],
}
