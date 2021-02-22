module.exports = {
  coverageDirectory: './coverage/',
  rootDir: './build/',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  testMatch: [
    '<rootDir>/test/**/*-test.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/',
  ],
  transform: {
    '\\.js$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/test/common.js',
  ],
  testEnvironment: 'node',
};
