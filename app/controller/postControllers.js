const { readUsersData,
    readPostsData,
    writePostsData,
    writeUsersData, } = require('../helper/fileManipulators');
const { InvalidToken,
    PostSuccessfullyAdded,
    NonExistentPost,
    LikeRegisterred, } = require('../util/messages');
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
        postId,
    });
}

/**
 * Middleware to like a post
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function likePost(req, res) {
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
    const postFileData = readPostsData();

    const { id: postId, type, } = req.params;

    if (! postFileData[postId]) {
        sendResponse(res, {
            statusCode: 403,
            message: NonExistentPost,
        });
        return;
    }

    const postData = postFileData[postId];
    postData.likes[userId] = type;

    writePostsData(postFileData);

    sendResponse(res, {
        statusCode: 200,
        message: LikeRegisterred,
    });
}

/**
 * Middleware to comment on a post
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function commentPost(req, res) {

}

module.exports = {
    createPost,
    likePost,
    commentPost,
};
