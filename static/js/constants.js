module.exports.CONNECTED = 'connected';
module.exports.DELETE_THING = 'deleteThing';
module.exports.DELETE_THINGS = 'deleteThings';
module.exports.EVENT_OCCURRED = 'eventOccurred';
module.exports.PROPERTY_STATUS = 'propertyStatus';
module.exports.REFRESH_THINGS = 'refreshThings';
module.exports.DELETE_GROUP = 'deleteGroup';
module.exports.DELETE_GROUPS = 'deleteGroups';

module.exports.ThingFormat = {
  INTERACTIVE: 0,
  EXPANDED: 1,
  LINK_ICON: 2,
};

module.exports.WoTOperation = {
  READ_PROPERTY: 'readproperty',
  WRITE_PROPERTY: 'writeproperty',
  INVOKE_ACTION: 'invokeaction',
  READ_ALL_PROPERTIES: 'readallproperties',
  WRITE_MULTIPLE_PROPERTIES: 'writemultipleproperties',
  SUBSCRIBE_ALL_EVENTS: 'subscribeallevents',
  UNSUBSCRIBE_ALL_EVENTS: 'unsubscribeallevents',
  QUERY_ALL_ACTIONS: 'queryallactions',
};
