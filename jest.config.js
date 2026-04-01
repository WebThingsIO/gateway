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
    '<rootDir>/test/browser/', // https://github.com/WebThingsIO/gateway/issues/3007
  ],
  transform: {
    '\\.[cm]?js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      sourceType: 'unambiguous',
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@exodus/bytes|@asamuzakjp|@bramus|@csstools|parse5|tough-cookie)/)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/common.js',
  ],
  testEnvironment: 'node',
  maxWorkers: 1,
};
