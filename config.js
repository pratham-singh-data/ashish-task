module.exports = {
    SALT: process.env.SALT,
    SECRETKEY: process.env.SECRETKEY,
    TOKENEXPIRATIONTIME: 30 * 60,
    CLEANUPINTERVAL: 24 * 60 * 60 * 100,
};
