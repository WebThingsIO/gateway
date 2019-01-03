require('../jsdom-common');
const {fireEvent, createSchemaForm} = require('./test-utils');

describe('NumberField', () => {
  describe('text input', () => {
    it('should render a string field', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
        },
      });

      expect(
        node.querySelectorAll('.field input')
      ).toHaveLength(1);
    });

    it('should render a string field with a label', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          title: 'foo',
        },
      });

      expect(node.querySelector('.field label').textContent.trim())
        .toEqual('foo');
    });

    it('should render a string field with a description', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          description: 'bar',
        },
      });

      expect(node.querySelector('.field-description').textContent.trim())
        .toEqual('bar');
    });

    it('should default state value to number', () => {
      const {schemaForm} = createSchemaForm({schema: {type: 'number'}});

      expect(typeof schemaForm.formData).toEqual('number');
    });

    it('should assign a default value', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          default: 2,
        },
      });

      expect(node.querySelector('.field input').value).toEqual('2');
    });

    it('should handle a change event', () => {
      const {schemaForm, node} = createSchemaForm({
        schema: {
          type: 'number',
        },
      });

      const input = node.querySelector('input');
      input.value = '2';
      fireEvent(input, 'change');

      expect(schemaForm.formData).toEqual(2);
    });

    it('should fill field with data', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
        },
        formData: 2,
      });

      expect(node.querySelector('.field input').value).toEqual('2');
    });

    it('should cast the input as a float number if it ends with a dot', () => {
      const {schemaForm, node} = createSchemaForm({
        schema: {
          type: 'number',
        },
      });

      const input = node.querySelector('input');
      input.value = '2.2';
      fireEvent(input, 'change');

      expect(schemaForm.formData).toEqual(2.2);
    });

    it('should render with the expected id', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
        },
      });

      expect(node.querySelector('input').id).toEqual('root');
    });

    it('should render with trailing zeroes', () => {
      const {schemaForm, node} = createSchemaForm({
        schema: {
          type: 'number',
        },
      });

      const input = node.querySelector('input');

      // TODO: uncomment this when jsdom is fixed. currently, it treats 2. as
      // invalid input, so value is reported as ""
      /*
      input.value = '2.';
      fireEvent(input, 'change');
      expect(node.querySelector('.field input').value).toEqual('2');
      expect(schemaForm.formData).toEqual(2);
      */

      input.value = '2.0';
      fireEvent(input, 'change');
      expect(node.querySelector('.field input').value).toEqual('2.0');
      expect(schemaForm.formData).toEqual(2);

      input.value = '2.00';
      fireEvent(input, 'change');
      expect(node.querySelector('.field input').value).toEqual('2.00');
      expect(schemaForm.formData).toEqual(2);

      input.value = '2.000';
      fireEvent(input, 'change');
      expect(node.querySelector('.field input').value).toEqual('2.000');
      expect(schemaForm.formData).toEqual(2);
    });
  });

  describe('slection input', () => {
    it('should render a number field', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
        },
      });

      expect(node.querySelectorAll('.field select')).toHaveLength(1);
    });

    it('should render a string field with a label', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
          title: 'foo',
        },
      });

      expect(node.querySelector('.field label').textContent.trim())
        .toEqual('foo');
    });

    it('should assign a default value', () => {
      const {schemaForm} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
          default: 1,
        },
      });

      expect(schemaForm.formData).toEqual(1);
    });

    it('should handle a change event', () => {
      const {schemaForm, node} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
        },
      });

      const select = node.querySelector('select');
      select.value = '2';
      fireEvent(select, 'change');

      expect(schemaForm.formData).toEqual(2);
    });

    it('should fill field with data', () => {
      const {schemaForm} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
        },
        formData: 2,
      });

      expect(schemaForm.formData).toEqual(2);
    });

    it('should render the select with the expected id', () => {
      const {node} = createSchemaForm({
        schema: {
          type: 'number',
          enum: [1, 2],
        },
      });

      expect(node.querySelector('select').id).toEqual('root');
    });
  });

  describe('range input', () => {
    const schema = {
      type: 'number',
      multipleOf: 1,
      minimum: 10,
      maximum: 100,
    };

    it('should support formData', () => {
      const {node} = createSchemaForm({
        schema,
        formData: 3.14,
      });

      expect(node.querySelector('[type=range]').value)
        .toEqual('3.14');
      expect(node.querySelector('.range-view').textContent.trim())
        .toEqual('3.14');
    });

    it('should update state when value is updated', () => {
      const {schemaForm, node} = createSchemaForm({
        schema,
        formData: 3.14,
      });

      const input = node.querySelector('[type=range]');
      input.value = '6.28';
      fireEvent(input, 'change');

      expect(schemaForm.formData).toEqual(6.28);
      expect(node.querySelector('.range-view').textContent.trim())
        .toEqual('6.28');
    });

    describe('Constraint attributes', () => {
      let input;

      beforeEach(() => {
        const {node} = createSchemaForm({schema});
        input = node.querySelector('[type=range]');
      });

      it('should support the minimum constraint', () => {
        expect(input.getAttribute('min')).toEqual('10');
      });

      it('should support maximum constraint', () => {
        expect(input.getAttribute('max')).toEqual('100');
      });

      it('should support \'0\' as minimum and maximum constraints', () => {
        const schema = {
          type: 'number',
          minimum: 0,
          maximum: 0,
        };

        const {node} = createSchemaForm({schema});
        input = node.querySelector('[type=range]');

        expect(input.getAttribute('min')).toEqual('0');
        expect(input.getAttribute('max')).toEqual('0');
      });

      it('should support the multipleOf constraint', () => {
        expect(input.getAttribute('step')).toEqual('1');
      });
    });
  });
});
