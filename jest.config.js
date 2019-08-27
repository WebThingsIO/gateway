const semver = require('semver');

const testPathIgnorePatterns = [
  '/node_modules/',
];
if (semver.major(process.versions.node) <= 9) {
  // fluent uses node 10 features
  testPathIgnorePatterns.push('<rootDir>/src/test/schema-form');
  testPathIgnorePatterns.push('<rootDir>/src/test/browser');
}

module.exports = {
  coverageDirectory: './coverage/',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  testMatch: [
    '**/test/**/*-test.(ts|tsx|js)',
  ],
  testPathIgnorePatterns,
  transform: {
    '\\.tsx?$': 'ts-jest',
    '\\.js?$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/test/common.js',
  ],
  testEnvironment: 'node',
};
