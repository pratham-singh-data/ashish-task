module.exports = {
    SALT: process.env.SALT,
    SECRETKEY: process.env.SECRETKEY,
    TOKENEXPIRATIONTIME: 1800, // 30 * 60
    CLEANUPINTERVAL: 8640000, // 24 * 60 * 60 * 100
};
