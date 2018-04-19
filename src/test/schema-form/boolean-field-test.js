require('../jsdom-common');
const {createSchemaForm} = require('./test-utils');

describe('BooleanField', () => {
  it('should render a boolean field', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
      },
    });

    expect(
      node.querySelectorAll('.field input[type=checkbox]')
    ).toHaveLength(1);
  });

  it('should render a boolean field with a label', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
        title: 'foo',
      },
    });

    expect(node.querySelector('.field span').textContent.trim()).toEqual('foo');
  });

  it('should render a single label', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
        title: 'foo',
      },
    });

    expect(node.querySelectorAll('.field span')).toHaveLength(1);
  });

  it('should render a description', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
        description: 'my description',
      },
    });

    const description = node.querySelector('.field-description');
    expect(description.textContent.trim()).toEqual('my description');
  });

  it('should assign a default value', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
        default: true,
      },
    });

    expect(node.querySelector('.field input').checked).toEqual(true);
  });

  it('should default state value to false', () => {
    const {schemaForm} = createSchemaForm({schema: {type: 'boolean'}});

    expect(schemaForm.formData).toEqual(false);
  });

  it('should handle a change event', () => {
    const {schemaForm, node} = createSchemaForm({
      schema: {
        type: 'boolean',
        default: false,
      },
    });

    node.querySelector('input').click();

    expect(schemaForm.formData).toEqual(true);
  });

  it('should fill field with data', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
      },
      formData: true,
    });

    expect(node.querySelector('.field input').checked).toEqual(true);
  });

  it('should render the input with the expected id', () => {
    const {node} = createSchemaForm({
      schema: {
        type: 'boolean',
      },
    });

    expect(node.querySelector('input[type=checkbox]').id).toEqual('root');
  });
});
