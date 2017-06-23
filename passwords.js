const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Hash a password asynchronously
   * @param {String} password
   * @return {Promise<String>} hashed password
   */
  hash: function(password) {
    return bcrypt.hash(password, 10);
  },

  /**
   * Hash a password synchronously
   * @param {String} password
   * @return {String} hashed password
   */
  hashSync: function(password) {
    return bcrypt.hashSync(password, 10);
  },

  /**
   * Compare two password hashes
   * @param {String} passwordText - a plain text password
   * @param {String} passwordHash - the expected hash
   * @return {boolean} If the hashes are equal
   */
  compareSync: function(passwordText, passwordHash) {
    return bcrypt.compareSync(passwordText, passwordHash);
  }
};
