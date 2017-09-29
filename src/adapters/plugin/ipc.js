'use strict';

const nanomsg = require('nanomsg');

const DEBUG = false;

class IpcSocket {

  constructor(name, socketType, onMsg) {
    this.name = name;
    this.socket = nanomsg.socket(socketType);
    this.onMsg = onMsg;

    this.socket.on('data', this.onData.bind(this));
  }

  bind(addr) {
    return this.socket.bind(addr);
  }

  connect(addr) {
    return this.socket.connect(addr);
  }

  close() {
    console.log('IpcSocket: closing for', this.name);
    this.socket.close();
  }

  /**
   * @method onData
   * @param {Buffer} buf
   *
   * Called anytime a new message has been received.
   */
  onData(buf) {
    var bufStr = buf.toString();
    try {
      var data = JSON.parse(bufStr);
    } catch (err) {
      console.error('Error parsing message as JSON');
      console.error('Rcvd: "' + bufStr + '"');
      console.error(err);
      return;
    }
    DEBUG && console.log('IPC:', this.name, 'Rcvd:', data);
    this.onMsg(data);
  }

  /**
   * @method sendJson
   * @param {dict} obj
   *
   * Async function which will convert the passed object
   * into json, send it and not wait for any type of reply.
   */
  sendJson(obj) {
    var jsonObj = JSON.stringify(obj);
    DEBUG && console.log('IPC:', this.name, 'Sending:', jsonObj);
    this.socket.send(jsonObj);
  }
}

module.exports = IpcSocket;
