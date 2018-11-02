'use strict';

const config = require('config');
const fs = require('fs');
const nanomsg = require('nanomsg');

const appInstance = require('../app-instance');

const DEBUG = false;
const DEBUG_MSG = false;

const boundAddrs = new Set();
const connectedAddrs = new Set();
let socketId = 0;

class IpcSocket {

  constructor(name, socketType, ipcBaseAddr, onMsg) {
    this.name = name;
    this.socketType = socketType;
    this.socket = nanomsg.socket(socketType);
    this.ipcBaseAddr = ipcBaseAddr;
    this.onMsg = onMsg;
    socketId += 1;
    this.socketId = socketId;

    this.protocol = config.get('ipc.protocol');
    switch (this.protocol) {
      case 'ipc':
        this.ipcFile = `/tmp/${ipcBaseAddr}`;
        break;

      case 'inproc':
        this.ipcFile = `${appInstance.get()}-${
          ipcBaseAddr}`;
        break;

      default: {
        const err = `Unsupported IPC protocol: ${this.protocol}`;
        console.error(err);
        throw err;
      }
    }
    this.ipcAddr = `${this.protocol}://${this.ipcFile}`;

    this.logPrefix = `IpcSocket${(`${this.socketId}`).padStart(3)}: ${
      this.name.padEnd(18)}:`;
    DEBUG && this.log('  alloc', this.ipcAddr, socketType);

    this.socket.on('data', this.onData.bind(this));
    this.connected = false;
    this.bound = false;
  }

  error() {
    Array.prototype.unshift.call(arguments, this.logPrefix);
    console.error.apply(null, arguments);
  }

  log() {
    Array.prototype.unshift.call(arguments, this.logPrefix);
    console.log.apply(null, arguments);
  }

  bind() {
    DEBUG && this.log('   bind', this.ipcAddr);

    if (this.bound) {
      this.error('socket already bound:', this.ipcAddr);
    }
    if (this.connected) {
      this.error('socket already connected:', this.ipcAddr);
    }
    this.bound = true;

    if (this.socketType === 'pair') {
      if (boundAddrs.has(this.ipcAddr)) {
        this.error('address already bound:', this.ipcAddr);
      }
      boundAddrs.add(this.ipcAddr);
    }

    if (this.protocol === 'ipc') {
      if (fs.existsSync(this.ipcFile)) {
        fs.unlinkSync(this.ipcFile);
      }
    }
    return this.socket.bind(this.ipcAddr);
  }

  connect() {
    DEBUG && this.log('connect', this.ipcAddr);

    if (this.bound) {
      this.error('socket already bound:', this.ipcAddr);
    }
    if (this.connected) {
      this.error('socket already connected:', this.ipcAddr);
    }
    this.connected = true;

    if (this.socketType === 'pair') {
      if (connectedAddrs.has(this.ipcAddr)) {
        this.error('address already connected:', this.ipcAddr);
      }
      connectedAddrs.add(this.ipcAddr);
    }

    return this.socket.connect(this.ipcAddr);
  }

  close() {
    DEBUG && this.log('  close', this.ipcAddr);
    if (this.connected) {
      this.connected = false;
      if (this.socketType === 'pair') {
        connectedAddrs.delete(this.ipcAddr);
      }
    } else if (this.bound) {
      this.bound = false;
      if (this.socketType === 'pair') {
        boundAddrs.delete(this.ipcAddr);
      }
    } else {
      this.error('socket not connected or bound:', this.ipcAddr);
    }
    this.socket.close();
  }

  /**
   * @method onData
   * @param {Buffer} buf
   *
   * Called anytime a new message has been received.
   */
  onData(buf) {
    const bufStr = buf.toString();
    let data;
    try {
      data = JSON.parse(bufStr);
    } catch (err) {
      this.error('Error parsing message as JSON');
      this.error(`Rcvd: "${bufStr}"`);
      this.error(err);
      return;
    }
    DEBUG_MSG && this.log(this.name, 'Rcvd:', data);
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
    const jsonObj = JSON.stringify(obj);
    DEBUG_MSG && this.log(this.name, 'Sending:', jsonObj);
    this.socket.send(jsonObj);
  }
}

module.exports = IpcSocket;
