const crypto = require('crypto');

module.exports = {
  getCacheKey(src, path, configString) {
    return crypto
      .createHash('md5')
      .update(src)
      .update(configString)
      .digest('hex');
  },
  process(src) {
    return src;
  },
};
