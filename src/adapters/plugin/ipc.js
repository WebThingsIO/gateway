'use strict';

const nanomsg = require('nanomsg');
const Deferred = require('../deferred');

const DEBUG = false;

class IpcSocket {

  constructor(name, socketType, onMsg) {
    this.name = name;
    this.socket = nanomsg.socket(socketType);
    this.id = 0;
    this.idBase = 0;
    this.deferredReply = null;
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
    this.socket.close();
  }

  /**
   * @method nextId
   * @returns the next available id (used for matching up requests
   *          and replies)
   *
   * If you think of the id as a 6-digit number (base 10), then
   * the last 3 digits increment for each message. The first digit
   * will be zero for messages originating from the gateway, and one
   * for messages originating from an adapter. The 2nd and 3rd digits
   * will be unique for each adapter.
   */
  nextId() {
    this.id += 1;
    this.id %= 1000;
    return this.idBase + this.id;
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
    var deferredReply = this.deferredReply;
    if (this.deferredReply &&
        data.id &&
        data.id == deferredReply.id) {
      this.deferredReply = null;
      DEBUG && console.log('IPC:', this.name, 'resolving promise');
      deferredReply.resolve(data);
    } else {
      DEBUG && console.log('IPC:', this.name, 'calling onMsg');
      this.onMsg(data);
    }
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

  /**
   * @method sendJsonGetReply
   * @param {dict} obj
   *
   * Converts `obj` to json, and sends it.
   * @returns a promise which resolves to the received reply.
   */
  sendJsonGetReply(obj) {
    var deferredReply = new Deferred();
    if (this.deferredReply) {
      console.error('Already waiting for a reply.');
      deferredReply.reject('already waiting for a reply');
    } else {
      obj.id = this.nextId();
      deferredReply.id = obj.id;

      this.deferredReply = deferredReply;
      var msg = JSON.stringify(obj);
      DEBUG && console.log('IPC:', this.name, 'Sending:', msg);
      this.socket.send(msg);
    }
    return deferredReply.promise;
  }
}

module.exports = IpcSocket;