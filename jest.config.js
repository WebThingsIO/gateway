module.exports = {
  coverageDirectory: './coverage/',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  testMatch: [
    '<rootDir>/build/test/**/*-test.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/',
  ],
  transform: {
    '\\.js$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/build/test/common.js',
  ],
  testEnvironment: 'node',
};
