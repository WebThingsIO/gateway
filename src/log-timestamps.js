/**
 * @module log-timestamps
 *
 * Modifies console.log and friends to prepend a timestamp to log lines.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const UserProfile = require('./user-profile');
const format = require('util').format;

class CustomFormatter {
  transform(info) {
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
      filename: 'run-app.log',
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

function logPrefix() {
  const currTime = new Date();
  return `${currTime.getFullYear()}-${
    (`0${currTime.getMonth() + 1}`).slice(-2)}-${
    (`0${currTime.getDate()}`).slice(-2)} ${
    (`0${currTime.getHours()}`).slice(-2)}:${
    (`0${currTime.getMinutes()}`).slice(-2)}:${
    (`0${currTime.getSeconds()}`).slice(-2)}.${
    (`00${currTime.getMilliseconds()}`).slice(-3)} `;
}

if (!console.constructor.hooked) {
  console.constructor.hooked = true;

  // BufferedConsole is used (under jest) when running multiple tests
  // CustomConsole is used (under jest) when running a single test

  if (console.constructor.name === 'BufferedConsole') {
    // The code for the write function comes from the jest source code:
    // https://github.com/facebook/jest/blob/master/packages/jest-util/
    //    src/buffered_console.js

    const callsites = require('callsites');

    console.constructor.write = function write(buffer, type, message, level) {
      const call = callsites()[level != null ? level : 2];
      const origin = `${call.getFileName()}:${call.getLineNumber()}`;
      buffer.push({message: logPrefix() + message, origin, type});
      return buffer;
    };

    console.log = function log() {
      console.constructor.write(
        this._buffer, 'log', format.apply(null, arguments));
    };
    console.info = function info() {
      console.constructor.write(
        this._buffer, 'info', format.apply(null, arguments));
    };
    console.warn = function warn() {
      console.constructor.write(
        this._buffer, 'warn', format.apply(null, arguments));
    };
    console.error = function error() {
      console.constructor.write(
        this._buffer, 'error', format.apply(null, arguments));
    };
    // jest's BufferedConsole doesn't provide a debug, so we skip it as well.
  } else if (console.constructor.name === 'CustomConsole') {
    // See: https://github.com/facebook/jest/blob/master/packages/jest-util/
    //        src/Console.js
    //      for the implementation of _log

    console.log = function log() {
      console._log('log', logPrefix() + format.apply(null, arguments));
    };

    console.info = function info() {
      console._log('info', logPrefix() + format.apply(null, arguments));
    };

    console.warn = function warn() {
      console._log('warn', logPrefix() + format.apply(null, arguments));
    };

    console.error = function error() {
      console._log('error', logPrefix() + format.apply(null, arguments));
    };
    // jest's CustomConsole doesn't provide a debug, so we skip it as well.
  } else {
    // This path is for the normal non-jest output
    const FUNCS = ['info', 'debug', 'error', 'warn', 'verbose', 'silly'];

    for (const func of FUNCS) {
      console[func] = function() {
        logger[func](format.apply(null, arguments));
      };
    }

    console.log = console.info;
  }
}
