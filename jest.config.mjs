/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.test.mts'],
  moduleFileExtensions: ['mts', 'js', 'json', 'node'],
  extensionsToTreatAsEsm: ['.mts'],

  /***  Make it work with ESM Modules ***/

  transform: {
    '^.+\\.(mts|ts)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  // https://github.com/microsoft/vscode-recipes/tree/main/debugging-jest-tests#configure-packagejson-file-for-your-test-framework
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
}

export default config
