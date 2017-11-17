'use strict';

const config = require('config');
const fs = require('fs');
const nanomsg = require('nanomsg');

var appInstance = require('../../app-instance');

const DEBUG = false;

class IpcSocket {

  constructor(name, socketType, ipcBaseAddr, onMsg) {
    this.name = name;
    this.socket = nanomsg.socket(socketType);
    this.ipcBaseAddr = ipcBaseAddr;
    this.onMsg = onMsg;

    this.protocol = config.get('ipc.protocol');
    switch (this.protocol) {
      case 'ipc':
        this.ipcFile = '/tmp/' + ipcBaseAddr;
        break;

      case 'inproc':
        this.ipcFile = appInstance.get() + '-' +
                       ipcBaseAddr;
        break;

      default:
        var err = 'Unsupported IPC protocol: ' + this.protocol;
        console.error(err);
        throw err;
    }
    this.ipcAddr = this.protocol + '://' + this.ipcFile;

    this.socket.on('data', this.onData.bind(this));
  }

  bind() {
    if (this.protocol === 'ipc') {
      if (fs.existsSync(this.ipcFile)) {
        fs.unlinkSync(this.ipcFile);
      }
    }
    DEBUG && console.log('IpcSocket:    bind', this.ipcAddr);
    return this.socket.bind(this.ipcAddr);
  }

  connect() {
    DEBUG && console.log('IpcSocket: connect', this.ipcAddr);
    return this.socket.connect(this.ipcAddr);
  }

  close() {
    DEBUG && console.log('IpcSocket:   close', this.ipcAddr);
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
