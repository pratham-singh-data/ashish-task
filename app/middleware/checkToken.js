const { SECRETKEY, } = require('../../config');
const { sendResponse, } = require('../util/sendResponse');
const jwt = require(`jsonwebtoken`);
const { InvalidToken,
    NonExistentUser,
    TokenIsNedded, } = require('../util/messages');
const { readTokensData,
    readUsersData, } = require('../helper/fileManipulators');

/**
 * Middleware to check that a token is sent and that it is valid
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 * @param {Function} next express next function.
 */
function checkToken(req, res, next) {
    if (! req.headers.token) {
        sendResponse(res, {
            statusCode: 400,
            message: TokenIsNedded,
        });
        return;
    }

    let userId;

    try {
        ({ id: userId, } = jwt.verify(req.headers.token, SECRETKEY));
    } catch (err) {
        sendResponse(res, {
            statusCode: 400,
            message: InvalidToken,
        });
        return;
    }

    const tokenFileData = readTokensData();
    const userFileData = readUsersData();

    if (! tokenFileData[req.headers.token]) {
        sendResponse(res, {
            statusCode: 400,
            message: InvalidToken,
        });
        return;
    }

    if (! userFileData[userId]) {
        sendResponse(res, {
            statusCode: 403,
            message: NonExistentUser,
        });
        return;
    }

    next();
}

module.exports = {
    checkToken,
};
