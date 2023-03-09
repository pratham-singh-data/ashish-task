const { TOKENEXPIRATIONTIME } = require('../../config');
const { readTokensData, writeTokensData, } = require('./fileManipulators');

/**
 * Function to cleanup tokens file
 */
function tokenCleanup() {
    const tokenFileData = readTokensData();

    for (const token of Object.keys(tokenFileData)) {
        if (tokenFileData[token] + TOKENEXPIRATIONTIME * 1000 < Date.now()) {
            delete tokenFileData[token];
        }
    }

    writeTokensData(tokenFileData);
}

module.exports = {
    tokenCleanup,
};
