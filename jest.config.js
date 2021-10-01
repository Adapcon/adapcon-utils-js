/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/*.+(test).[tj]s?(x)',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
