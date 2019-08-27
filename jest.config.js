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
  transform: {
    '\\.tsx?$': 'ts-jest',
    '\\.js?$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/test/common.js',
  ],
  testEnvironment: 'node',
};
