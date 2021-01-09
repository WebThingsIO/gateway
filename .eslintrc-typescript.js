module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'jasmine': true,
    'jest': true,
    'mocha': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'arrow-parens': [
      'error',
      'always'
    ],
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': [
      'error',
      'always'
    ],
    '@typescript-eslint/brace-style': [
      'error',
      '1tbs'
    ],
    '@typescript-eslint/comma-dangle': [
      'error',
      'always-multiline'
    ],
    '@typescript-eslint/comma-spacing': 'error',
    'comma-style': [
      'error',
      'last'
    ],
    'computed-property-spacing': [
      'error',
      'never'
    ],
    'curly': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        'allowArgumentsExplicitlyTypedAsAny': true
      }
    ],
    '@typescript-eslint/func-call-spacing': [
      'error',
      'never'
    ],
    'implicit-arrow-linebreak': [
      'error',
      'beside'
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        'ArrayExpression': 'first',
        'CallExpression': {
          'arguments': 'first'
        },
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'FunctionExpression': {
          'parameters': 'first'
        },
        'ObjectExpression': 'first',
        'SwitchCase': 1
      }
    ],
    'key-spacing': [
      'error',
      {
        'afterColon': true,
        'beforeColon': false,
        'mode': 'strict'
      }
    ],
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        'after': true,
        'before': true
      }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always'
    ],
    'max-len': [
      'error',
      100
    ],
    'multiline-ternary': [
      'error',
      'always-multiline'
    ],
    'no-console': 0,
    '@typescript-eslint/no-duplicate-imports': 'error',
    'no-eval': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-floating-decimal': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-lonely-if': 'error',
    'no-multi-spaces': [
      'error',
      {
        'ignoreEOLComments': true
      }
    ],
    'no-multiple-empty-lines': 'error',
    '@typescript-eslint/no-namespace': [
      'error',
      {
        'allowDeclarations': true
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-prototype-builtins': 'off',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-undefined': 'error',
    'no-unmodified-loop-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }
    ],
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-newline': [
      'error',
      {
        'consistent': true
      }
    ],
    'object-curly-spacing': [
      'error',
      'never'
    ],
    'object-property-newline': [
      'error',
      {
        'allowMultiplePropertiesPerLine': true
      }
    ],
    'operator-linebreak': [
      'error',
      'after'
    ],
    'padded-blocks': [
      'error',
      {
        'blocks': 'never'
      }
    ],
    'prefer-const': 'error',
    'prefer-template': 'error',
    'quote-props': [
      'error',
      'as-needed'
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        'allowTemplateLiterals': true
      }
    ],
    '@typescript-eslint/semi': [
      'error',
      'always'
    ],
    'semi-spacing': [
      'error',
      {
        'after': true,
        'before': false
      }
    ],
    'semi-style': [
      'error',
      'last'
    ],
    'space-before-blocks': [
      'error',
      'always'
    ],
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        'anonymous': 'never',
        'asyncArrow': 'always',
        'named': 'never'
      }
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'error',
      {
        'nonwords': false,
        'words': true
      }
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        'block': {
          'balanced': true,
          'exceptions': [
            '*'
          ]
        }
      }
    ],
    'switch-colon-spacing': [
      'error',
      {
        'after': true,
        'before': false
      }
    ],
    'template-curly-spacing': [
      'error',
      'never'
    ],
    '@typescript-eslint/type-annotation-spacing': 'error',
    'yoda': 'error'
  }
};
