/**
 * @module log-timestamps
 *
 * Modifies console.log and friends to prepend a timestamp to log lines.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import callsites from 'callsites';
import {
  BufferedConsole,
  ConsoleBuffer,
  CustomConsole,
  LogMessage,
  LogType,
} from '@jest/console';
import {TransformableInfo} from 'logform';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import UserProfile from './user-profile';
import {format} from 'util';

class CustomFormatter {
  transform(info: TransformableInfo): TransformableInfo {
    const level = info.level.toUpperCase().padEnd(7, ' ');
    info.message = `${info.timestamp} ${level}: ${info.message}`;
    return info;
  }
}

const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss.SSS',
});

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        timestampFormat,
        new CustomFormatter(),
        winston.format.colorize({
          all: true,
          colors: {
            debug: 'white',
            info: 'dim white',
            warn: 'yellow',
            error: 'red',
          },
        }),
        winston.format.printf((info) => info.message)
      ),
    }),
    new DailyRotateFile({
      dirname: UserProfile.logDir,
      filename: 'run-app.log.%DATE%',
      symlinkName: 'run-app.log',
      createSymlink: true,
      zippedArchive: false,
      maxSize: '10m',
      maxFiles: 10,
      format: winston.format.combine(
        timestampFormat,
        new CustomFormatter(),
        winston.format.printf((info) => info.message)
      ),
    }),
  ],
  exitOnError: false,
});

function logPrefix(): string {
  const currTime = new Date();
  return `${currTime.getFullYear()}-${
    (`0${currTime.getMonth() + 1}`).slice(-2)}-${
    (`0${currTime.getDate()}`).slice(-2)} ${
    (`0${currTime.getHours()}`).slice(-2)}:${
    (`0${currTime.getMinutes()}`).slice(-2)}:${
    (`0${currTime.getSeconds()}`).slice(-2)}.${
    (`00${currTime.getMilliseconds()}`).slice(-3)} `;
}

if (!(console.constructor as any).hooked) {
  (console.constructor as any).hooked = true;

  // BufferedConsole is used (under jest) when running multiple tests
  // CustomConsole is used (under jest) when running a single test

  if (console.constructor.name === 'BufferedConsole') {
    // See:
    //   https://github.com/facebook/jest/blob/master/packages/jest-console/src/BufferedConsole.ts
    const bufferedConsole = <BufferedConsole>console;

    BufferedConsole.write =
      function(buffer: ConsoleBuffer, type: LogType, message: LogMessage, level?: number | null) {
        const call = callsites()[level ?? 2];
        const origin = `${call.getFileName()}:${call.getLineNumber()}`;
        buffer.push({message: logPrefix() + message, origin, type});
        return buffer;
      };

    bufferedConsole.log = function(message: any, ...args: any[]) {
      BufferedConsole.write((this as any)._buffer, 'log', format.apply(null, [message, ...args]));
    };

    bufferedConsole.info = function(message: any, ...args: any[]) {
      BufferedConsole.write((this as any)._buffer, 'info', format.apply(null, [message, ...args]));
    };

    bufferedConsole.warn = function(message: any, ...args: any[]) {
      BufferedConsole.write((this as any)._buffer, 'warn', format.apply(null, [message, ...args]));
    };

    bufferedConsole.error = function(message: any, ...args: any[]) {
      BufferedConsole.write((this as any)._buffer, 'error', format.apply(null, [message, ...args]));
    };

    bufferedConsole.debug = function(message: any, ...args: any[]) {
      BufferedConsole.write((this as any)._buffer, 'debug', format.apply(null, [message, ...args]));
    };
  } else if (console.constructor.name === 'CustomConsole') {
    // See:
    //   https://github.com/facebook/jest/blob/master/packages/jest-console/src/CustomConsole.ts
    const customConsole = <CustomConsole>console;

    customConsole.log = function(message: any, ...args: any[]) {
      (customConsole as any)._log('log', logPrefix() + format.apply(null, [message, ...args]));
    };

    customConsole.info = function(message: any, ...args: any[]) {
      (customConsole as any)._log('info', logPrefix() + format.apply(null, [message, ...args]));
    };

    customConsole.warn = function(message: any, ...args: any[]) {
      (customConsole as any)._log('warn', logPrefix() + format.apply(null, [message, ...args]));
    };

    customConsole.error = function(message: any, ...args: any[]) {
      (customConsole as any)._log('error', logPrefix() + format.apply(null, [message, ...args]));
    };

    customConsole.debug = function(message: any, ...args: any[]) {
      (customConsole as any)._log('debug', logPrefix() + format.apply(null, [message, ...args]));
    };
  } else {
    // This path is for the normal non-jest output
    console.info = function(message: any, ...args: any[]) {
      logger.info(format.apply(null, [message, ...args]));
    };

    console.debug = function(message: any, ...args: any[]) {
      logger.debug(format.apply(null, [message, ...args]));
    };

    console.error = function(message: any, ...args: any[]) {
      logger.error(format.apply(null, [message, ...args]));
    };

    console.warn = function(message: any, ...args: any[]) {
      logger.warn(format.apply(null, [message, ...args]));
    };

    console.log = console.info;
  }
}
