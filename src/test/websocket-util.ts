import e2p from 'event-to-promise';
import WebSocket from 'ws';
import {server} from './common';
import {AddressInfo} from 'net';

interface WithUnreadMessages {
  unreadMessages?: string[];
}

/**
 * Open a websocket
 * @param {String} path
 * @param {String} jwt
 * @return {WebSocket}
 */
export async function webSocketOpen(path: string, jwt: string):
Promise<WebSocket & WithUnreadMessages> {
  if (!server.address()) {
    server.listen(0);
  }
  const addr = <AddressInfo>server.address()!;
  const socketPath =
    `wss://127.0.0.1:${addr.port}${path}?jwt=${jwt}`;

  const ws: WebSocket & WithUnreadMessages = new WebSocket(socketPath);
  ws.unreadMessages = [];

  ws.on('message', (message: string) => {
    ws.unreadMessages!.push(message);
  });

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
export async function webSocketRead(ws: WebSocket & WithUnreadMessages, expectedMessages: number,
                                    ignoreConnected = true): Promise<Record<string, unknown>[]> {
  const messages = [];
  while (messages.length < expectedMessages) {
    if (ws.unreadMessages!.length > 0) {
      const data = ws.unreadMessages!.shift();
      const parsed = JSON.parse(data!);

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
export async function webSocketSend(ws: WebSocket, message: unknown): Promise<void> {
  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }

  await new Promise<void>((resolve) => {
    ws.send(message, () => {
      resolve();
    });
  });
}

/**
 * Close a WebSocket and wait for it to be closed
 */
export async function webSocketClose(ws: WebSocket): Promise<void> {
  ws.close();
  await e2p(ws, 'close');
}
