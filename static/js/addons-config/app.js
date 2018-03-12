'use strict';

/* globals SchemaForm */

var App = {
  /**
   * Start app.
   */
  init: function () {
    this.container = document.getElementById('form');
    const schema =
      {
        'type': 'object',
        'title': 'Number fields & widgets',
        'properties': {
          'number': {
            'title': 'Number',
            'type': 'number'
          },
          'integer': {
            'title': 'Integer',
            'type': 'integer'
          },
          'numberEnum': {
            'type': 'number',
            'title': 'Number enum',
            'enum': [
              1,
              2,
              3
            ]
          },
          'numberEnumRadio': {
            'type': 'number',
            'title': 'Number enum',
            'enum': [
              1,
              2,
              3
            ]
          },
          'integerRange': {
            'title': 'Integer range',
            'type': 'integer',
            'minimum': 42,
            'maximum': 100
          },
          'integerRangeSteps': {
            'title': 'Integer range (by 10)',
            'type': 'integer',
            'minimum': 50,
            'maximum': 100,
            'multipleOf': 10
          }
        }
      };
    const id = 'addons';
    const name = 'addon-configs';
    const formData =
      {
        'number': 3.14,
        'integer': 42,
        'numberEnum': 2,
        'integerRange': 42,
        'integerRangeSteps': 100
      };
    this.container.appendChild(new SchemaForm(schema, id, name)
      .render(formData));
  }

};


window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
