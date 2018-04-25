'use strict';
const STATIC_JS_PATH = '../../../static/js';

const SchemaForm = require(`${STATIC_JS_PATH}/addons-config/schema-form`);

module.exports.createSchemaForm =
function({schema, formData, addonName = 'test'}) {
  const schemaForm = new SchemaForm(schema, 'test', addonName, formData);
  const node = schemaForm.render();
  return {schemaForm, node};
};
module.exports.fireEvent = function(element, event) {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(event, true, true);
  return !element.dispatchEvent(evt);
};

module.exports.makeUndefined = function() {};

