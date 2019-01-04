require('../jsdom-common');
const {fireEvent, createSchemaForm, makeUndefined} = require('./test-utils');

describe('ArrayField', () => {
  describe('Unsupported array schema', () => {
    it('should warn on missing items descriptor', () => {
      const {node} = createSchemaForm({schema: {type: 'array'}});

      expect(node.querySelector('.field-array > .unsupported-field')
        .textContent.trim()).toContain('Unsupported field schema');
    });
  });

  describe('List of inputs', () => {
    const schema = {
      type: 'array',
      title: 'my list',
      description: 'my description',
      items: {type: 'string'},
    };

    it('should render a fieldset', () => {
      const {node} = createSchemaForm({schema});

      expect(node.querySelectorAll('fieldset')).toHaveLength(1);
    });

    it('should render a fieldset legend', () => {
      const {node} = createSchemaForm({schema});

      const legend = node.querySelector('fieldset > legend');

      expect(legend.textContent.trim()).toEqual('my list');
      expect(legend.id).toEqual('root__title');
    });

    it('should render a description', () => {
      const {node} = createSchemaForm({schema});

      const description = node.querySelector('fieldset > .field-description');

      expect(description.textContent.trim()).toEqual('my description');
      expect(description.id).toEqual('root__description');
    });

    it('should contain no field in the list by default', () => {
      const {node} = createSchemaForm({schema});

      expect(node.querySelectorAll('.field-string')).toHaveLength(0);
    });

    it('should have an add button', () => {
      const {node} = createSchemaForm({schema});

      expect(node.querySelector('.btn-add')).not.toEqual(null);
    });

    it('should not have an add button if addable is false', () => {
      const {node} = createSchemaForm({
        schema,
        uiSchema: {'ui:options': {addable: false}},
      });

      expect(node.querySelector('.btn-add')).toBeNull;
    });

    it('should add a new field when clicking the add button', () => {
      const {node} = createSchemaForm({schema});

      node.querySelector('.btn-add').click();

      expect(node.querySelectorAll('.field-string')).toHaveLength(1);
    });

    it('should not provide an add button if length equals maxItems', () => {
      const {node} = createSchemaForm({
        schema: {maxItems: 2, ...schema},
        formData: ['foo', 'bar'],
      });

      expect(node.querySelector('.btn-add')).toBeNull();
    });

    it('should provide an add button if length is lesser than maxItems', () => {
      const {node} = createSchemaForm({
        schema: {maxItems: 2, ...schema},
        formData: ['foo'],
      });

      expect(node.querySelector('.btn-add')).not.toEqual(null);
    });

    it('should mark a non-null array item as required', () => {
      const {node} = createSchemaForm({schema});

      node.querySelector('.btn-add').click();

      expect(node.querySelector('.field-string input[type=text]').required)
        .toEqual(true);
    });

    it('should convert non-array data to array', () => {
      const {schemaForm, node} = createSchemaForm({
        schema,
        formData: {},
      });

      node.querySelector('.btn-add').click();

      const inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(1);
      // eslint-disable-next-line no-undefined
      expect(schemaForm.formData).toEqual([undefined]);
    });

    it('should fill an array field with data', () => {
      const {node} = createSchemaForm({
        schema,
        formData: ['foo', 'bar'],
      });
      const inputs = node.querySelectorAll('.field-string input[type=text]');

      expect(inputs).toHaveLength(2);
      expect(inputs[0].value).toEqual('foo');
      expect(inputs[1].value).toEqual('bar');
    });

    it('should remove a field from the list', () => {
      const {node} = createSchemaForm({
        schema,
        formData: ['foo', 'bar'],
      });
      const dropBtns = node.querySelectorAll('.btn-remove');

      dropBtns[0].click();

      const inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(1);
      expect(inputs[0].value).toEqual('bar');
    });

    it('should remove a field from middle of the list', () => {
      const {node} = createSchemaForm({
        schema,
        formData: ['foo', 'bar', 'foobar'],
      });
      let dropBtns = node.querySelectorAll('.btn-remove');

      dropBtns[1].click();

      let inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(2);
      expect(inputs[0].value).toEqual('foo');
      expect(inputs[1].value).toEqual('foobar');
      dropBtns = node.querySelectorAll('.btn-remove');
      expect(dropBtns).toHaveLength(2);

      dropBtns[1].click();
      inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(1);
      expect(inputs[0].value).toEqual('foo');
      dropBtns = node.querySelectorAll('.btn-remove');
      expect(dropBtns).toHaveLength(1);
    });

    it('should remove a field from middle of the nested list', () => {
      const schemaFormlexSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                bar: {type: 'string'},
                baz: {type: 'string'},
              },
            },
          },
        },
      };
      const {node} = createSchemaForm({
        schema: schemaFormlexSchema,
        formData: {
          foo: [
            {bar: 'bar1', baz: 'baz1'},
            {bar: 'bar2', baz: 'baz2'},
            {bar: 'bar3', baz: 'baz3'},
          ],
        },
      });

      let dropBtns = node.querySelectorAll('.btn-remove');

      dropBtns[1].click();

      let inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(4);
      expect(inputs[0].value).toEqual('bar1');
      expect(inputs[1].value).toEqual('baz1');
      expect(inputs[2].value).toEqual('bar3');
      expect(inputs[3].value).toEqual('baz3');
      dropBtns = node.querySelectorAll('.btn-remove');
      expect(dropBtns).toHaveLength(2);

      dropBtns[1].click();
      inputs = node.querySelectorAll('.field-string input[type=text]');
      expect(inputs).toHaveLength(2);
      expect(inputs[0].value).toEqual('bar1');
      expect(inputs[1].value).toEqual('baz1');
      dropBtns = node.querySelectorAll('.btn-remove');
      expect(dropBtns).toHaveLength(1);
    });

    it('should handle cleared field values in the array', () => {
      const schema = {
        type: 'array',
        items: {type: 'integer'},
      };
      const formData = [1, 2, 3];
      const {schemaForm, node} = createSchemaForm({
        schema,
        formData,
      });

      const input = node.querySelector('#root_1');
      expect(input.value).toEqual('2');
      input.value = '';
      fireEvent(input, 'change');

      expect(schemaForm.formData).toEqual([1, null, 3]);
    });

    it('should render the input with the expected ids', () => {
      const {node} = createSchemaForm({
        schema,
        formData: ['foo', 'bar'],
      });

      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs[0].id).toEqual('root_0');
      expect(inputs[1].id).toEqual('root_1');
    });

    it('should render nested input with the expected ids', () => {
      const schemaFormlexSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                bar: {type: 'string'},
                baz: {type: 'string'},
              },
            },
          },
        },
      };
      const {node} = createSchemaForm({
        schema: schemaFormlexSchema,
        formData: {
          foo: [{bar: 'bar1', baz: 'baz1'}, {bar: 'bar2', baz: 'baz2'}],
        },
      });

      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs[0].id).toEqual('root_foo_0_bar');
      expect(inputs[1].id).toEqual('root_foo_0_baz');
      expect(inputs[2].id).toEqual('root_foo_1_bar');
      expect(inputs[3].id).toEqual('root_foo_1_baz');
    });

    it('should render enough inputs with proper defaults to match ' +
     'minItems in schema when no formData is set', () => {
      const schemaFormlexSchema = {
        type: 'object',
        definitions: {
          Thing: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                default: 'Default name',
              },
            },
          },
        },
        properties: {
          foo: {
            type: 'array',
            minItems: 2,
            items: {
              $ref: '#/definitions/Thing',
            },
          },
        },
      };
      const form = createSchemaForm({schema: schemaFormlexSchema,
                                     formData: {}});
      const inputs = form.node.querySelectorAll('input[type=text]');
      expect(inputs[0].value).toEqual('Default name');
      expect(inputs[1].value).toEqual('Default name');
    });

    it('should render an input for each default value, ' +
     'even when this is greater than minItems', () => {
      const schema = {
        type: 'object',
        properties: {
          turtles: {
            type: 'array',
            minItems: 2,
            default: ['Raphael', 'Michaelangelo', 'Donatello', 'Leonardo'],
            items: {
              type: 'string',
            },
          },
        },
      };
      const {node} = createSchemaForm({schema: schema});
      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs.length).toEqual(4);
      expect(inputs[0].value).toEqual('Raphael');
      expect(inputs[1].value).toEqual('Michaelangelo');
      expect(inputs[2].value).toEqual('Donatello');
      expect(inputs[3].value).toEqual('Leonardo');
    });

    it('should render enough input to match minItems, ' +
    'populating the first with default values, and the rest empty', () => {
      const schema = {
        type: 'object',
        properties: {
          turtles: {
            type: 'array',
            minItems: 4,
            default: ['Raphael', 'Michaelangelo'],
            items: {
              type: 'string',
            },
          },
        },
      };
      const {node} = createSchemaForm({schema});
      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs.length).toEqual(4);
      expect(inputs[0].value).toEqual('Raphael');
      expect(inputs[1].value).toEqual('Michaelangelo');
      expect(inputs[2].value).toEqual('');
      expect(inputs[3].value).toEqual('');
    });

    it('should render enough input to match minItems, populating the first ' +
    'with default values, and the rest with the item default', () => {
      const schema = {
        type: 'object',
        properties: {
          turtles: {
            type: 'array',
            minItems: 4,
            default: ['Raphael', 'Michaelangelo'],
            items: {
              type: 'string',
              default: 'Unknown',
            },
          },
        },
      };
      const {node} = createSchemaForm({schema});
      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs.length).toEqual(4);
      expect(inputs[0].value).toEqual('Raphael');
      expect(inputs[1].value).toEqual('Michaelangelo');
      expect(inputs[2].value).toEqual('Unknown');
      expect(inputs[3].value).toEqual('Unknown');
    });

    it('should not add minItems extra formData entries ' +
    'when schema item is a multiselect', () => {
      const schema = {
        type: 'object',
        properties: {
          multipleChoicesList: {
            type: 'array',
            minItems: 3,
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['Aramis', 'Athos', 'Porthos', 'd\'Artagnan'],
            },
          },
        },
      };
      const {schemaForm} = createSchemaForm({
        schema: schema,
        formData: {},
      });

      const {errors} = schemaForm.validate(schemaForm.formData);
      expect(schemaForm.formData).toHaveProperty('multipleChoicesList');
      expect(schemaForm.formData.multipleChoicesList).toHaveLength(0);
      expect(errors.length).toEqual(1);
      expect(errors[0].keyword).toEqual('minItems');
      expect(errors[0].params.limit).toEqual(3);
    });

    it('should honor given formData, even when it does not ' +
    'meet ths minItems-requirement', () => {
      const schemaFormlexSchema = {
        type: 'object',
        definitions: {
          Thing: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                default: 'Default name',
              },
            },
          },
        },
        properties: {
          foo: {
            type: 'array',
            minItems: 2,
            items: {
              $ref: '#/definitions/Thing',
            },
          },
        },
      };
      const {node} = createSchemaForm({
        schema: schemaFormlexSchema,
        formData: {foo: []},
      });
      const inputs = node.querySelectorAll('input[type=text]');
      expect(inputs.length).toEqual(0);
    });
  });

  describe('Multiple choices list', () => {
    const schema = {
      type: 'array',
      title: 'My field',
      items: {
        enum: ['foo', 'bar', 'fuzz'],
        type: 'string',
      },
      uniqueItems: true,
    };

    describe('Checkboxes', () => {
      it('should render the expected number of checkboxes', () => {
        const {node} = createSchemaForm({schema});

        expect(node.querySelectorAll('[type=checkbox]')).toHaveLength(3);
      });

      it('should render the expected labels', () => {
        const {node} = createSchemaForm({schema});

        const labels = [].map.call(
          node.querySelectorAll('fieldset span'),
          (node) => node.textContent.trim()
        );
        expect(labels).toEqual(['foo', 'bar', 'fuzz']);
      });

      it('should handle a change event', () => {
        const {schemaForm, node} = createSchemaForm({schema});

        node.querySelectorAll('[type=checkbox]')[0].click();
        node.querySelectorAll('[type=checkbox]')[2].click();

        expect(schemaForm.formData).toEqual(['foo', 'fuzz']);
      });

      it('should fill field with data', () => {
        const {node} = createSchemaForm({
          schema,
          formData: ['foo', 'fuzz'],
        });

        const labels = [].map.call(
          node.querySelectorAll('[type=checkbox]'),
          (node) => node.checked
        );
        expect(labels).toEqual([true, false, true]);
      });
    });
  });

  describe('Nested lists', () => {
    const schema = {
      type: 'array',
      title: 'A list of arrays',
      items: {
        type: 'array',
        title: 'A list of numbers',
        items: {
          type: 'number',
        },
      },
    };

    it('should render two lists of inputs inside of a list', () => {
      const {node} = createSchemaForm({
        schema,
        formData: [[1, 2], [3, 4]],
      });
      expect(node.querySelectorAll('fieldset fieldset')).toHaveLength(2);
    });

    it('should add an inner list when clicking the add button', () => {
      const {node} = createSchemaForm({schema});
      expect(node.querySelectorAll('fieldset fieldset')).toHaveLength(0);

      node.querySelector('.btn-add').click();

      expect(node.querySelectorAll('fieldset fieldset')).toHaveLength(1);
    });
  });

  describe('Fixed items lists', () => {
    const schema = {
      type: 'array',
      title: 'List of fixed items',
      items: [
        {
          type: 'string',
          title: 'Some text',
        },
        {
          type: 'number',
          title: 'A number',
        },
      ],
    };

    const schemaAdditional = {
      type: 'array',
      title: 'List of fixed items',
      items: [
        {
          type: 'number',
          title: 'A number',
        },
        {
          type: 'number',
          title: 'Another number',
        },
      ],
      additionalItems: {
        type: 'string',
        title: 'Additional item',
      },
    };

    it('should render a fieldset', () => {
      const {node} = createSchemaForm({schema});

      expect(node.querySelectorAll('fieldset')).toHaveLength(1);
    });

    it('should render a fieldset legend', () => {
      const {node} = createSchemaForm({schema});
      const legend = node.querySelector('fieldset > legend');
      expect(legend.textContent.trim()).toEqual('List of fixed items');
      expect(legend.id).toEqual('root__title');
    });

    it('should render field', () => {
      const {node} = createSchemaForm({schema});
      const strInput = node.querySelector(
        'fieldset .field-string input[type=text]'
      );
      const numInput = node.querySelector(
        'fieldset .field-number input[type=number]'
      );
      expect(strInput.id).toEqual('root_0');
      expect(numInput.id).toEqual('root_1');
    });

    it('should mark non-null item as required', () => {
      const {node} = createSchemaForm({schema});
      const strInput = node.querySelector(
        'fieldset .field-string input[type=text]'
      );
      const numInput = node.querySelector(
        'fieldset .field-number input[type=number]'
      );
      expect(strInput.required).toEqual(true);
      expect(numInput.required).toEqual(true);
    });

    it('should fill fields with data', () => {
      const {node} = createSchemaForm({schema, formData: ['foo', 42]});
      const strInput = node.querySelector(
        'fieldset .field-string input[type=text]'
      );
      const numInput = node.querySelector(
        'fieldset .field-number input[type=number]'
      );
      expect(strInput.value).toEqual('foo');
      expect(numInput.value).toEqual('42');
    });

    it('should handle change events', () => {
      const {schemaForm, node} = createSchemaForm({schema});
      const strInput = node.querySelector(
        'fieldset .field-string input[type=text]'
      );
      const numInput = node.querySelector(
        'fieldset .field-number input[type=number]'
      );

      strInput.value = 'bar';
      fireEvent(strInput, 'change');
      numInput.value = '101';
      fireEvent(numInput, 'change');

      expect(schemaForm.formData).toEqual(['bar', 101]);
    });

    it('should generate additional fields and fill data', () => {
      const {node} = createSchemaForm({
        schema: schemaAdditional,
        formData: [1, 2, 'bar'],
      });
      const addInput = node.querySelector(
        'fieldset .field-string input[type=text]'
      );
      expect(addInput.id).toEqual('root_2');
      expect(addInput.value).toEqual('bar');
    });

    it('should have an add button if additionalItems is an object', () => {
      const {node} = createSchemaForm({schema: schemaAdditional});
      expect(node.querySelector('.btn-add')).not.toBeNull;
    });

    it('should not have an add button if additionalItems is not set', () => {
      const {node} = createSchemaForm({schema});
      expect(node.querySelector('.btn-add')).toBeNull;
    });

    it('should not have an add button if addable is false', () => {
      const {node} = createSchemaForm({
        schema,
        uiSchema: {'ui:options': {addable: false}},
      });
      expect(node.querySelector('.btn-add')).toBeNull;
    });

    it('[fixed-noadditional] should not provide an add button ' +
    'regardless maxItems', () => {
      const {node} = createSchemaForm({
        schema: {maxItems: 3, ...schema},
      });

      expect(node.querySelector('.btn-add')).toBeNull;
    });

    it('[fixed] should not provide an add button if length equals maxItems',
       () => {
         const {node} = createSchemaForm({
           schema: {maxItems: 2, ...schemaAdditional},
         });

         expect(node.querySelector('.btn-add')).toBeNull;
       });

    it('[fixed] should provide an add button if length is lesser ' +
    'than maxItems', () => {
      const {node} = createSchemaForm({
        schema: {maxItems: 3, ...schemaAdditional},
      });

      expect(node.querySelector('.btn-add')).not.toBeNull;
    });

    describe('operations for additional items', () => {
      const {schemaForm, node} = createSchemaForm({
        schema: schemaAdditional,
        formData: [1, 2, 'foo'],
      });

      it('should add a field when clicking add button', () => {
        node.querySelector('.btn-add').click();

        expect(node.querySelectorAll('.field-string')).toHaveLength(2);
        expect(schemaForm.formData).toEqual([1, 2, 'foo', makeUndefined()]);
      });

      it('should change the state when changing input value', () => {
        const inputs = node.querySelectorAll('.field-string input[type=text]');

        inputs[0].value = 'bar';
        fireEvent(inputs[0], 'change');
        inputs[1].value = 'baz';
        fireEvent(inputs[1], 'change');

        expect(schemaForm.formData).toEqual([1, 2, 'bar', 'baz']);
      });

      it('should remove array items when clicking remove buttons', () => {
        let dropBtns = node.querySelectorAll('.btn-remove');

        dropBtns[0].click();

        expect(node.querySelectorAll('.field-string')).toHaveLength(1);
        expect(schemaForm.formData).toEqual([1, 2, 'baz']);

        dropBtns = node.querySelectorAll('.btn-remove');
        dropBtns[0].click();

        expect(node.querySelectorAll('.field-string')).toHaveLength(0);
        expect(schemaForm.formData).toEqual([1, 2]);
      });
    });
  });
});
