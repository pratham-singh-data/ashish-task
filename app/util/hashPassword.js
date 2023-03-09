const crypto = require(`crypto`);
const { SALT, } = require('../../config');

/**
 * Function to evaluate hash value corresponding to given password.
 * @param {string} password password to hash.
 * @return {string} hashed password.
 */
function hashPassword(password) {
    return crypto.pbkdf2Sync(password,
        SALT,
        1000,
        64,
        `sha256`).toString(`hex`);
}

module.exports = {
    hashPassword,
};
