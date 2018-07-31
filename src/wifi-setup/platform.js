/* eslint-disable */
/*
 * # Raspberry Pi (we'll treat this as the default)
 * pi@gateway:~ $ uname -a
 * Linux gateway 4.4.13-v7+ #894 SMP Mon Jun 13 13:13:27 BST 2016 armv7l GNU/Linux
 *
 */

const uname =
    require('child_process').execFileSync('uname', ['-a'], {encoding: 'utf8'});

/* eslint-enable */

const platform = require('./platforms/default.js');

module.exports = platform;
