const e2p = require('event-to-promise');
const WebSocket = require('ws');

const {server} = require('./common');

/**
 * Open a websocket
 * @param {String} path
 * @param {String} jwt
 * @return {WebSocket}
 */
async function openWebSocket(path, jwt) {
  let addr = server.address();
  let socketPath =
    `wss://127.0.0.1:${addr.port}${path}?jwt=${jwt}`;

  const ws = new WebSocket(socketPath);
  await e2p(ws, 'open');
  return ws;
}

/**
 * Read a known amount of messages from a websocket
 * @param {WebSocket} ws
 * @param {number} expectedMessages
 * @return {Array<Object>} read messages
 */
async function readWebSocket(ws, expectedMessages) {
  let messages = [];
  for (let i = 0; i < expectedMessages; i++) {
    const {data} = await e2p(ws, 'message');
    const parsed = JSON.parse(data);
    messages.push(parsed);
  }
  return messages;
}

/**
 * Close a WebSocket and wait for it to be closed
 */
async function closeWebSocket(ws) {
  ws.close();
  await e2p(ws, 'close');
}

module.exports = {
  openWebSocket,
  readWebSocket,
  closeWebSocket
};
