module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'browser': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'no-console': 0,
    // TODO: Turn this back on...
    'no-unused-vars': 0,
    'max-len': ['error', 80],
    // TODO: Turn this back on...
    'no-redeclare': 0,
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
    }],
  }
};
