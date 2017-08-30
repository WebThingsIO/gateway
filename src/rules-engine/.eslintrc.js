module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'browser': true,
    'jest': true,
    'mocha': true,
    'jasmine': true,
  },
  'extends': 'eslint:recommended',
  'parser': 'babel-eslint',
  'parserOptions': {
    'sourceType': 'module'
  },
  'plugins': [
    'html'
  ],
  'rules': {
    'no-console': 0,
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_'
    }],
    'max-len': ['error', 80],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
    }],
  }
};
