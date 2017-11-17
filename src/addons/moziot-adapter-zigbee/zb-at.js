/**
 *
 * AT command builder/parser
 *
 * This follows the pattern used for the xbee-api, and builds the
 * buffer needed for the frame.commandParameters (for AT commands)
 * or parses frame.commandData (for AT responses).
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var assert = require('assert');
var BufferBuilder = require('buffer-builder');
var BufferReader = require('buffer-reader');
var xbeeApi = require('xbee-api');

var C = xbeeApi.constants;

var ac = exports.AT_CMD = {};

ac.APPLY_CHANGES = 'AC';
ac[ac.APPLY_CHANGES] = 'Apply Changes (AC)';

ac.API_OPTIONS = 'AO';
ac[ac.API_OPTIONS] = 'API Options (AO)';

ac.OPERATING_CHANNEL = 'CH';
ac[ac.OPERATING_CHANNEL] = 'Operating Channel (CH)';

ac.DEVICE_TYPE_IDENTIFIER = 'DD';
ac[ac.DEVICE_TYPE_IDENTIFIER] = 'Device Type Identifier (DD)';

ac.ENCRYPTION_ENABLED = 'EE';
ac[ac.ENCRYPTION_ENABLED] = 'Encyption Enabled (EE)';

ac.ENCRYPTION_OPTIONS = 'EO';
ac[ac.ENCRYPTION_OPTIONS] = 'Encryption Options (EO)';

ac.CONFIGURED_64_BIT_PAN_ID = 'ID';
ac[ac.CONFIGURED_64_BIT_PAN_ID] = 'Configured 64-bit PAN ID (ID)';

ac.LINK_KEY = 'KY';
ac[ac.LINK_KEY] = 'Link Key (KY)';

ac.NETWORK_ADDR_16_BIT = 'MY';
ac[ac.NETWORK_ADDR_16_BIT] = '16-bit Network Address (MY)';

ac.NUM_REMAINING_CHILDREN = 'NC';
ac[ac.NUM_REMAINING_CHILDREN] = 'Num Remaining Children (NC)';

ac.NODE_IDENTIFIER = 'NI';
ac[ac.NODE_IDENTIFIER] = 'Node Identifier (NI)';

ac.NODE_JOIN_TIME = 'NJ';
ac[ac.NODE_JOIN_TIME] = 'Node Join Time (NJ)';

ac.OPERATING_16_BIT_PAN_ID = 'OI';
ac[ac.OPERATING_16_BIT_PAN_ID] = 'Operating 16-bit PAN ID (OI)';

ac.OPERATING_64_BIT_PAN_ID = 'OP';
ac[ac.OPERATING_64_BIT_PAN_ID] = 'Operating 64-bit PAN ID (OP)';

ac.SCAN_CHANNELS = 'SC';
ac[ac.SCAN_CHANNELS] = 'Scan Channels (SC)';

ac.SERIAL_NUMBER_HIGH = 'SH';
ac[ac.SERIAL_NUMBER_HIGH] = 'Serial Number High (SH)';

ac.SERIAL_NUMBER_LOW = 'SL';
ac[ac.SERIAL_NUMBER_LOW] = 'Serial Number High (SL)';

ac.WRITE_PARAMETERS = 'WR';
ac[ac.WRITE_PARAMETERS] = 'Write Parameters (WR)';

ac.ZIGBEE_STACK_PROFILE = 'ZS';
ac[ac.ZIGBEE_STACK_PROFILE] = 'ZigBee Stack Profile (ZS)';

var atBuilder = module.exports.atBuilder = {};
var atParser = module.exports.atParser = {};

class AtApi {
  constructor() {

  }

  makeFrame(command, frame) {
    assert(command, 'Caller must provide command');

    if (frame) {
      frame.type = C.FRAME_TYPE.AT_COMMAND;
      frame.command = command;

      if (!(command in atBuilder)) {
        throw new Error('This library does not implement data for the AT "' +
                        command + '" command.');
      }

      var atData = Buffer.alloc(32); // AT Command Data
      var builder = new BufferBuilder(atData);

      atBuilder[command](frame, builder);

      frame.commandParameter = atData.slice(0, builder.length);
    } else {
      frame = {
        type: C.FRAME_TYPE.AT_COMMAND,
        command: command,
        commandParameter: []
      };
    }

    return frame;
  }

  parseFrame(frame) {
    assert(frame, 'Frame parameter must be a frame object');
    if (frame.command in atParser) {
      var reader = new BufferReader(frame.commandData);
      atParser[frame.command](frame, reader);
    }
  }
}

exports.AtApi = AtApi;

//---------------------------------------------------------------------------
//
// Builders
//
//---------------------------------------------------------------------------

atBuilder[ac.API_OPTIONS] = function(frame, builder) {
  builder.appendUInt8(frame.apiOptions);
};

atBuilder[ac.CONFIGURED_64_BIT_PAN_ID] = function(frame, builder) {
  builder.appendString(frame.configuredPanId, 'hex');
};

atBuilder[ac.ENCRYPTION_ENABLED] = function(frame, builder) {
  builder.appendUInt8(frame.encryptionEnabled);
};

atBuilder[ac.ENCRYPTION_OPTIONS] = function(frame, builder) {
  builder.appendUInt8(frame.encryptionOptions);
};

atBuilder[ac.LINK_KEY] = function(frame, builder) {
  var data;
  if (Array.isArray(frame.linkKey) || Buffer.isBuffer(frame.linkKey)) {
    data = Buffer.from(frame.linkKey);
  } else {
    data = Buffer.from(frame.linkKey, 'ascii');
  }
  builder.appendBuffer(data);
};

atBuilder[ac.NODE_IDENTIFIER] = function(builder, data) {
  assert(typeof(data) === 'string', 'data must be a string');

  // Leading spaces aren't allowed (so we remove them)
  // Embedded commas aren't allowed (so we remove them)
  // Finally, the length is limited to 20 printable ASCII characters.
  data = data.replace(/,/g, '')
             .replace(/[^\x20-\x7e]+/g, '')
             .trim()
             .slice(0,20);

  builder.appendString(data, 'ascii');
};

atBuilder[ac.NODE_JOIN_TIME] = function(frame, builder) {
  builder.appendUInt8(frame.nodeJoinTime);
};

atBuilder[ac.ZIGBEE_STACK_PROFILE] = function(frame, builder) {
  builder.appendUInt8(frame.zigBeeStackProfile);
};

//---------------------------------------------------------------------------
//
// Parsers
//
//---------------------------------------------------------------------------

atParser[ac.API_OPTIONS] = function(frame, reader) {
  frame.apiOptions = reader.nextUInt8();
};

atParser[ac.CONFIGURED_64_BIT_PAN_ID] = function(frame, reader) {
  frame.configuredPanId64 = reader.nextString(8, 'hex');
};

atParser[ac.DEVICE_TYPE_IDENTIFIER] = function(frame, reader) {
  frame.deviceTypeIdentifier = reader.nextUInt32BE();
};

atParser[ac.ENCRYPTION_ENABLED] = function(frame, reader) {
  frame.encryptionEnabled = reader.nextUInt8();
};

atParser[ac.ENCRYPTION_OPTIONS] = function(frame, reader) {
  frame.encryptionOptions = reader.nextUInt8();
};

atParser[ac.NETWORK_ADDR_16_BIT] = function(frame, reader) {
  frame.networkAddr16 = reader.nextString(2, 'hex');
};

atParser[ac.NODE_IDENTIFIER] = function(frame, reader) {
  frame.nodeIdentifier =
    reader.nextString(frame.commandData.length, 'ascii').trim();
};

atParser[ac.NODE_JOIN_TIME] = function(frame, reader) {
  frame.networkJoinTime = reader.nextUInt8();
};

atParser[ac.NUM_REMAINING_CHILDREN] = function(frame, reader) {
  frame.numRemainingChildren = reader.nextUInt8();
};

atParser[ac.OPERATING_16_BIT_PAN_ID] = function(frame, reader) {
  frame.operatingPanId16 = reader.nextString(2, 'hex');
};

atParser[ac.OPERATING_64_BIT_PAN_ID] = function(frame, reader) {
  frame.operatingPanId64 = reader.nextString(8, 'hex');
};

atParser[ac.OPERATING_CHANNEL] = function(frame, reader) {
  frame.operatingChannel = reader.nextUInt8();
};

atParser[ac.SCAN_CHANNELS] = function(frame, reader) {
  frame.scanChannels = reader.nextUInt16BE();
};

atParser[ac.SERIAL_NUMBER_HIGH] = function(frame, reader) {
  frame.serialNumberHigh = reader.nextString(4, 'hex');
};

atParser[ac.SERIAL_NUMBER_LOW] = function(frame, reader) {
  frame.serialNumberLow = reader.nextString(4, 'hex');
};

atParser[ac.ZIGBEE_STACK_PROFILE] = function(frame, reader) {
  frame.zigBeeStackProfile = reader.nextUInt8();
};
