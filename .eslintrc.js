module.exports = {
  plugins: [
    'html'
  ],
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
  'rules': {
    'no-console': 0,
    'max-len': ['error', 80],
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
    }],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', {
      'asyncArrow': 'always',
      'anonymous': 'never',
      'named': 'never',
    }],
    'comma-spacing': 'error',
    'eol-last': 'error',
    'space-in-parens': ['error', 'never'],
    'keyword-spacing': ['error', {
      'before': true,
      'after': true,
    }],
    'no-shadow-restricted-names': 'error',
    'no-undefined': 'error',
    'block-scoped-var': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'no-floating-decimal': 'error',
    'no-eval': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-multi-spaces': ['error', {
      'ignoreEOLComments': true,
    }],
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'yoda': 'error',
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true,
      'mode': 'strict',
    }],
    'lines-between-class-members': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'multiline-ternary': ['error', 'always-multiline'],
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'operator-linebreak': ['error', 'after'],
    'padded-blocks': ['error', {
      'blocks': 'never',
    }],
    'semi-spacing': ['error', {
      'before': false,
      'after': true,
    }],
    'semi-style': ['error', 'last'],
    'spaced-comment': ['error', 'always', {
      'block': {
        'exceptions': ['*'],
        'balanced': true,
      },
    }],
    'switch-colon-spacing': ['error', {
      'after': true,
      'before': false,
    }],
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
  }
};
