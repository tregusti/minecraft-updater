/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.test.mjs'],

  /***  Make it work with ESM Modules ***/

  transform: {},
  // https://github.com/microsoft/vscode-recipes/tree/main/debugging-jest-tests#configure-packagejson-file-for-your-test-framework
  testEnvironment: 'node',
}

module.exports = config
