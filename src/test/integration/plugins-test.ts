import Plugin from '../../plugin/plugin';

describe('plugins/', () => {
  it('Test the plugin start mechanism (good exec)', async () => {
    // The use of the mock adapter already tests most of the methods in the
    // Plugin class. However it doesn't test the start method, so we add
    // some tests here to do that.

    const plugin = new Plugin('plugin-start-test', null, true);
    plugin.setExec('node -e process.exit(42);');
    await plugin.start();

    // Normally, the plugin mechanism would try to restart the plugin
    // when it exits, so we set restart to false to prevent that.
    plugin.setRestart(false);
    const promise = new Promise((resolve) => {
      plugin.getProcess().p!.on('exit', (code) => {
        console.log('Got exit code', 42);
        resolve(code);
      });
    });
    const code = await promise;
    expect(code).toEqual(42);

    plugin.shutdown();
  });

  it('Test the plugin start mechanism (bad exec)', async () => {
    const plugin = new Plugin('plugin-start-test', null, true);
    plugin.setExec('./something-that-doesnt-exist');
    await plugin.start();
    const promise = new Promise((resolve) => {
      plugin.getProcess().p!.on('error', (err: any) => {
        console.log('Got err.code', err.code);
        resolve(err);
      });
    });
    const err: any = await promise;
    expect(err.code).toEqual('ENOENT');

    plugin.shutdown();
  });

  it('Test the plugin restart mechanism', async () => {
    const plugin = new Plugin('plugin-start-test', null, true);
    plugin.setExec('node -e process.exit(42);');
    await plugin.start();

    // setup a different exit code the next time it restarts
    plugin.setExec('node -e process.exit(43);');

    const code = await new Promise((resolve) => {
      plugin.getProcess().p!.on('exit', async (code) => {
        console.log('Got first exit code:', code);
        if (code == 42) {
          plugin.setRestart(false);
          await plugin.getStartPromise()!;
          // When the process was restarted plugin.process will have
          // been reassigned, so we need to re-register the exit handler.
          plugin.getProcess().p!.on('exit', (code) => {
            console.log('Got second exit code:', code);
            resolve(code);
          });
        }
      });
    });
    expect(code).toEqual(43);

    plugin.shutdown();
  });
});
