/**
 * Intent Parser Model
 *
 * Interface to the intent parser.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const net = require('net');
var IntentParser = {

    keyword: 'turn,switch,make,change',
    type: 'on,off,red,orange,yellow,green,white,blue,purple,magenta,pink',

    /**
    * Interface train the intent parser
    */
    train: function(data) {
        return new Promise((resolve, reject) => {
            let socket_client = new net.Socket();
            socket_client.connect(5555, '127.0.0.1', function() {
                let things = '';
                for (const key of Object.keys(data)) {
                    things += data[key].name + ',';
                }
                console.log('Connected to intent parser server');
                socket_client.on('data', function(data) {
                    console.log('Training result:' + data);
                    resolve(data);
                });
                socket_client.write('t:' + IntentParser.keyword +
                    '|' + IntentParser.type + '|' + things.slice(0, -1));
            });
            socket_client.on('error', function(data) {
                console.log('Training error:' + data);
                reject();
            });
        });
    },

    /**
    * Interface to query the intent parser
    */
    query: function(query) {
        return new Promise((resolve, reject) => {
            let socket_client = new net.Socket();
            socket_client.connect(5555, '127.0.0.1', function() {
                socket_client.on('data', function(data) {
                    console.log('Received: ' + data);
                    if (data == '-1') {
                        reject();
                    } else {
                        let jsonBody = JSON.parse(data);
                        resolve({
                            cmd: 'IOT',
                            href: '',
                            param: jsonBody.Location,
                            param2: jsonBody.Type,
                            param3: jsonBody.Type
                        });
                    }
                });
                socket_client.write('q:' + query);
            });
            socket_client.on('error', function(data) {
                console.log('Query error:' + data);
                reject();
            });
        });
    }
}

module.exports = IntentParser;