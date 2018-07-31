const child_process = require('child_process');

module.exports = run;

// A Promise-based version of child_process.exec(). It rejects the
// promise if there is an error or if there is any output to stderr.
// Otherwise it resolves the promise to the text that was printed to
// stdout (with any leading and trailing whitespace removed).
function run(command, environment) {
  return new Promise(function(resolve, reject) {
    console.log('Running command:', command);
    const options = {};
    if (environment) {
      options.env = environment;
    }
    child_process.exec(command, options, function(error, stdout, stderr) {
      if (error) {
        console.log('Error running command:', error);
        reject(error);
      } else if (stderr && stderr.length > 0) {
        console.log('Command wrote to stderr, assuming failure:', stderr);
        reject(new Error(`${command} output to stderr: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
