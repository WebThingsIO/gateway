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
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'sourceType': 'module'
  },
  'plugins': [
    'html',
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
    '@typescript-eslint/default-param-last': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        'allowArgumentsExplicitlyTypedAsAny': true
      }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        'allowExpressions': true
      }
    ],
    '@typescript-eslint/func-call-spacing': [
      'error',
      'never'
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
    '@typescript-eslint/keyword-spacing': 'off',
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
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        },
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        }
      }
    ],
    'multiline-ternary': [
      'error',
      'always-multiline'
    ],
    'no-console': 0,
    '@typescript-eslint/no-duplicate-imports': 'error',
    'no-eval': 'error',
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        'ignoreRestArgs': true
      }
    ],
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
    'no-throw-literal': 'error',
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
      'always'
    ],
    'object-property-newline': [
      'error',
      {
        'allowMultiplePropertiesPerLine': true
      }
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        'overrides': {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'padded-blocks': [
      'error',
      {
        'blocks': 'never'
      }
    ],
    'prefer-const': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
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
        'anonymous': 'always',
        'asyncArrow': 'always',
        'named': 'never'
      }
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    '@typescript-eslint/space-infix-ops': 'error',
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
  },
  'overrides': [
    {
      'files': [
        '**/*.js'
      ],
      'rules': {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
