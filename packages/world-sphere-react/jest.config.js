const base = require('../../jest.config')

module.exports = {
  ...base,
  displayName: 'react module tests',
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/__test__/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^react($|/.+)": "<rootDir>/node_modules/react$1",
    'three/examples/jsm/': '<rootDir>/__test__/mocks/mockUndefined.js'
  }
}