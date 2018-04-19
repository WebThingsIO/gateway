require('../jsdom-common');
const {makeUndefined, fireEvent, createSchemaForm} = require('./test-utils');

describe('Validation', () => {
  describe('Required fields', () => {
    const schema = {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {type: 'string'},
        bar: {type: 'string'},
      },
    };

    it('should render errors', () => {
      const {node} = createSchemaForm({
        schema,
        formData: {
          foo: makeUndefined(),
        },
      });

      fireEvent(node.querySelector('#root_foo'), 'change');

      expect(node.querySelectorAll('.errors-list li')).toHaveLength(1);
      expect(node.querySelector('.errors-list li').textContent.trim())
        .toEqual('.foo is a required property');
    });
  });

  describe('Min length', () => {
    const schema = {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {
          type: 'string',
          minLength: 10,
        },
      },
    };

    it('should render errors', () => {
      const {node} = createSchemaForm({
        schema,
        formData: {
          foo: '123456789',
        },
      });

      fireEvent(node.querySelector('#root_foo'), 'change');

      expect(node.querySelectorAll('.error-item')).toHaveLength(1);
      expect(node.querySelector('.error-item').textContent.trim())
        .toEqual('.foo should NOT be shorter than 10 characters');
    });
  });
});
