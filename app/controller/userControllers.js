const Joi = require('joi');
const { readUsersData,
    writeUsersData,
    readTokensData,
    writeTokensData, } = require('../helper/fileManipulators');
const { hashPassword, } = require('../util/hashPassword');
const { EmailInUse,
    UserSuccessfullyRegisterred,
    CredentialDoNotMatch,
    SuccessfulLogin,
    SuccessfulLogout, } = require('../util/messages');
const { sendResponse, } = require('../util/sendResponse');
const { userRegistrationSchema, } =
    require('../validator/userRegistrationSchema');
const jwt = require(`jsonwebtoken`);
const { SECRETKEY, TOKENEXPIRATIONTIME, } = require('../../config');
const { userLoginSchema, } = require('../validator/userLoginSchema');

/**
 * Middleware to register user
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function registerUser(req, res) {
    let body;

    try {
        body = Joi.attempt(req.body, userRegistrationSchema);
    } catch (err) {
        sendResponse(res, {
            statusCode: 400,
            message: err.message,
        });
        return;
    }

    const userFileData = readUsersData();

    if (userFileData[body.email]) {
        sendResponse(res, {
            statusCode: 403,
            message: EmailInUse,
        });
        return;
    }

    userFileData[body.email] = body;

    body.password = hashPassword(body.password);
    body.posts = {};

    writeUsersData(userFileData);

    const token = jwt.sign({
        id: body.email,
    }, SECRETKEY, {
        expiresIn: TOKENEXPIRATIONTIME,
    });

    // register token in database
    const tokenFileData = readTokensData();
    tokenFileData[token] = Date.now();
    writeTokensData(tokenFileData);

    sendResponse(res, {
        statusCode: 200,
        message: UserSuccessfullyRegisterred,
        token: token,
    });
}

/**
 * Middleware to login an existing user
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function loginUser(req, res) {
    let body;

    try {
        body = Joi.attempt(req.body, userLoginSchema);
    } catch (err) {
        sendResponse(res, {
            statusCode: 400,
            message: err.message,
        });
        return;
    }

    const userFileData = readUsersData();

    if (! userFileData[body.email] ||
        userFileData[body.email].password !== hashPassword(body.password)) {
        sendResponse(res, {
            statusCode: 403,
            message: CredentialDoNotMatch,
        });
        return;
    }

    const token = jwt.sign({
        id: body.email,
    }, SECRETKEY, {
        expiresIn: TOKENEXPIRATIONTIME,
    });

    // register token in database
    const tokenFileData = readTokensData();
    tokenFileData[token] = Date.now();
    writeTokensData(tokenFileData);

    sendResponse(res, {
        statusCode: 200,
        message: SuccessfulLogin,
        token: token,
    });
}

/**
 * Middleware to logout an existing user
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function logoutUser(req, res) {
    const tokenFileData = readTokensData();

    delete tokenFileData[req.headers.token];

    writeTokensData(tokenFileData);

    sendResponse(res, {
        statusCode: 200,
        message: SuccessfulLogout,
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
