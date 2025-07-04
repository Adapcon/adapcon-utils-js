module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/constants/*.ts'
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
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  coveragePathIgnorePatterns: ['<rootDir>/src/dao', '<rootDir>/src/lambda/lambdaService', '<rootDir>/src/secretsManager/secretManager', '<rootDir>/src/promise', '<rootDir>/src/s3/s3Service']
}
