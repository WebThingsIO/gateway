module.exports = {
  coverageDirectory: './coverage/',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  testMatch: [
    '**/test/**/*-test.(ts|js)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/test/common.js',
  ],
  testEnvironment: 'node',
};
