export default {
  // Environment
  testEnvironment: 'node',

  // ES module support
  transform: {
    '^.+\\.js$': ['babel-jest', { 
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]] 
    }]
  },
  
  // File detection
  testMatch: [
    "**/__tests__/**/*.js",
    "**/*.test.js"
  ],
  
  // Async timeouts
  testTimeout: 10000, // 10 seconds timeout for async operations

  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  coverageDirectory: "coverage",

  // Ignore patterns
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.aws-sam/"
  ],

  // Output
  verbose: true,

  // Mock clearing
  clearMocks: true,
  resetMocks: true,
};