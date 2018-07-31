module.exports = function wait(milliseconds) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, milliseconds);
  });
};
