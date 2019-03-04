const e2p = require('event-to-promise');
const WebSocket = require('ws');

const {server} = require('./common');

/**
 * Open a websocket
 * @param {String} path
 * @param {String} jwt
 * @return {WebSocket}
 */
async function webSocketOpen(path, jwt) {
  if (!server.address()) {
    server.listen(0);
  }
  const addr = server.address();
  const socketPath =
    `wss://127.0.0.1:${addr.port}${path}?jwt=${jwt}`;

  const ws = new WebSocket(socketPath);
  ws.unreadMessages = [];

  ws.on('message', function(message) {
    this.unreadMessages.push(message);
  }.bind(ws));

  await e2p(ws, 'open');

  // Allow the app to handle the websocket open reaaallly slowwwwllllyyyy
  await new Promise((res) => {
    setTimeout(res, 250);
  });

  return ws;
}

/**
 * Read a known amount of messages from a websocket
 * @param {WebSocket} ws
 * @param {number} expectedMessages
 * @param {boolean?} ignoreConnected - Whether or not to ignore 'connected'
 *                   messages
 * @return {Array<Object>} read messages
 */
async function webSocketRead(ws, expectedMessages, ignoreConnected = true) {
  const messages = [];
  while (messages.length < expectedMessages) {
    if (ws.unreadMessages.length > 0) {
      const data = ws.unreadMessages.shift();
      const parsed = JSON.parse(data);

      if (ignoreConnected && parsed.messageType === 'connected') {
        continue;
      }

      messages.push(parsed);
    } else {
      await e2p(ws, 'message');
    }
  }
  return messages;
}

/**
 * Send a JSON message over a websocket
 * @param {WebSocket} ws
 * @param {Object|string} message
 */
async function webSocketSend(ws, message) {
  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }

  await new Promise((resolve) => {
    ws.send(message, () => {
      resolve();
    });
  });
}

/**
 * Close a WebSocket and wait for it to be closed
 */
async function webSocketClose(ws) {
  ws.close();
  await e2p(ws, 'close');
}

module.exports = {
  webSocketOpen,
  webSocketRead,
  webSocketSend,
  webSocketClose,
};
