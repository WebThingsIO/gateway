
/**
 * Ensures a given promise will not throw similar to a "final" cluase.
 *
 * Useful for tests where you want either the error or result object.
 */
function final(p) {
  return Promise.resolve(p).catch((v) => v);
}

module.exports = final;
