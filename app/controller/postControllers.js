const { readUsersData,
    readPostsData,
    writePostsData,
    writeUsersData, } = require('../helper/fileManipulators');
const { InvalidToken, PostSuccessfullyAdded, } = require('../util/messages');
const { sendResponse, } = require('../util/sendResponse');
const { createPostSchema, } = require('../validator/createPostSchema');
const jwt = require(`jsonwebtoken`);
const { SECRETKEY, } = require('../../config');
const Joi = require(`joi`);
const uuid = require(`uuid`);

/**
 * Middleware to create a post
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function createPost(req, res) {
    let userId;

    try {
        ({ id: userId, } = jwt.verify(req.headers.token, SECRETKEY));
    } catch (err) {
        console.log(err.message);
        sendResponse(res, {
            statusCode: 400,
            message: InvalidToken,
        });
        return;
    }

    try {
        body = Joi.attempt(req.body, createPostSchema);
    } catch (err) {
        sendResponse(res, {
            statusCode: 400,
            message: err.message,
        });
        return;
    }

    const userFileData = readUsersData();
    const postFileData = readPostsData();

    const userData = userFileData[userId];

    const postId = uuid.v4();
    userData.posts[postId] = Date.now();
    postFileData[postId] = body;

    body.likes = {};
    body.comments = {};
    body.userId = userId;

    writePostsData(postFileData);
    writeUsersData(userFileData);

    sendResponse(res, {
        statusCode: 400,
        message: PostSuccessfullyAdded,
    });
}

/**
 * Middleware to like a post
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function likePost(req, res) {

}

module.exports = {
    createPost,
    likePost,
};
