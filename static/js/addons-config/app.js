'use strict';

/* globals SchemaForm */

var App = {
  /**
   * Start app.
   */
  init: function() {
    this.container = document.getElementById('form');
    const schema =
      {
        'definitions': {
          'Thing': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string',
                'default': 'Default name',
              },
            },
          },
        },
        'type': 'object',
        'title': 'Number fields & widgets',
        'required': [
          'number',
          'enumString',
          'integerRange',
        ],
        'properties': {
          'number': {
            'title': 'Number',
            'type': 'number',
          },
          'integer': {
            'title': 'Integer',
            'type': 'integer',
          },
          'numberEnum': {
            'type': 'number',
            'title': 'Number enum',
            'enum': [
              1,
              2,
              3,
            ],
          },
          'numberEnumRadio': {
            'type': 'number',
            'title': 'Number enum',
            'enum': [
              1,
              2,
              3,
            ],
          },
          'integerRange': {
            'title': 'Integer range',
            'type': 'integer',
            'minimum': 42,
            'maximum': 100,
          },
          'integerRangeSteps': {
            'title': 'Integer range (by 10)',
            'type': 'integer',
            'minimum': 50,
            'maximum': 100,
            'multipleOf': 10,
          },
          'stringTitle': {
            'type': 'string',
            'title': 'Title',
            'description': 'A sample title',
          },
          'enumString': {
            'type': 'string',
            'enum': [
              'option #0',
              'option #1',
              'option #2',
              'option #3',
              'option #4',
            ],
          },
          'done': {
            'type': 'boolean',
            'title': 'Done?',
            'default': true,
          },
          'listOfStrings': {
            'type': 'array',
            'title': 'A list of strings',
            'items': {
              'type': 'string',
              'default': 'bazinga',
            },
          },
          'multipleChoicesList': {
            'type': 'array',
            'title': 'A multiple choices list',
            'items': {
              'type': 'string',
              'enum': [
                'foo',
                'bar',
                'fuzz',
                'qux',
              ],
            },
            'uniqueItems': true,
          },
          'fixedItemsList': {
            'type': 'array',
            'title': 'A list of fixed items',
            'items': [
              {
                'title': 'A string value',
                'type': 'string',
                'default': 'lorem ipsum',
              },
              {
                'title': 'a boolean value',
                'type': 'boolean',
              },
            ],
            'additionalItems': {
              'title': 'Additional item',
              'type': 'number',
            },
          },
          'tasks': {
            'type': 'array',
            'title': 'Tasks',
            'items': {
              'type': 'object',
              'required': [
                'title',
              ],
              'properties': {
                'title': {
                  'type': 'string',
                  'title': 'Title',
                  'description': 'A sample title',
                },
                'details': {
                  'type': 'string',
                  'title': 'Task details',
                  'description': 'Enter the task details',
                },
                'done': {
                  'type': 'boolean',
                  'title': 'Done?',
                  'default': false,
                },
              },
            },
          },
        },
      };
    const id = 'addons';
    const name = 'addon-configs';
    const formData =
      {
        'number': 3.14,
        'integer': 42,
        'numberEnum': 2,
        'integerRangeSteps': 100,
      };
    this.container.appendChild(new SchemaForm(schema, id, name)
      .render(formData));
  },

};


window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
