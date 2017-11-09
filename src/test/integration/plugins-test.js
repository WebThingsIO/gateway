'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const Plugin = require('../../adapters/plugin/plugin');

describe('plugins/', function() {

  it('Test the plugin start mechanism (good exec)', async () => {

    // The use of the mock adapter already tests most of the methods in the
    // Plugin class. however it doesn't test the start method.

    let plugin = new Plugin('plugin-start-test', null);
    plugin.exec = 'node -e process.exit(42);';
    plugin.start();
    // Normnally, the plugin mechanism would try to restart the plugin
    // when it exits, so we set restart to false to prevent that.
    plugin.restart = false;
    let promise = new Promise(resolve => {
      plugin.process.on('exit', code => {
        console.log('Got exit code', 42);
        resolve(code);
      });
    });
    let code = await(promise);
    expect(code).toEqual(42);

    plugin.shutdown();
  });

  it('Test the plugin start mechanism (bad exec)', async () => {
    let plugin = new Plugin('plugin-start-test', null);
    plugin.exec = './something-that-doesnt-exist';
    plugin.start();
    let promise = new Promise(resolve => {
      plugin.process.on('error', err => {
        console.log('Got err.code', err.code);
        resolve(err);
      });
    });
    let err = await(promise);
    expect(err.code).toEqual('ENOENT');

    plugin.shutdown();
  });

  it('Test the plugin restart mechanism', async () => {
    let plugin = new Plugin('plugin-start-test', null);
    plugin.exec = 'node -e process.exit(42);';
    plugin.start();

    // setup a different exit code the next time it restarts
    plugin.exec = 'node -e process.exit(43);';

    let promise = new Promise(resolve => {
      plugin.process.on('exit', code => {
        console.log('Got exit code', code);
        if (code == 42) {
          plugin.restart = false;
          // When the process was restarted plugin.process will have
          // been reassigned, so we need to re-register the exit handler.
          plugin.process.on('exit', code => {
            console.log('Got exit code', code);
            resolve(code);
          });
        }
      });
    });
    let code = await(promise);
    expect(code).toEqual(43);

    plugin.shutdown();
  });

});
