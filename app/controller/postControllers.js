const { readUsersData,
    readPostsData,
    writePostsData,
    writeUsersData,
    readCommentsData,
    writeCommentsData, } = require('../helper/fileManipulators');
const { InvalidToken,
    PostSuccessfullyAdded,
    NonExistentPost,
    LikeRegisterred,
    CommentAdded, } = require('../util/messages');
const { sendResponse, } = require('../util/sendResponse');
const { createPostSchema, } = require('../validator/createPostSchema');
const jwt = require(`jsonwebtoken`);
const { SECRETKEY, } = require('../../config');
const Joi = require(`joi`);
const uuid = require(`uuid`);
const { addCommentSchema, } = require('../validator/addCommentSchema');

/**
 * Middleware to create a post
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function createPost(req, res) {
    let userId;

    // verify again in case token expired between calls
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

    // validate schema
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

    // generate data
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

    // verify again in case token expired between calls
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

    // check that post exists
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
    let userId;

    // verify again in case token expired between calls
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

    // validate schema
    try {
        body = Joi.attempt(req.body, addCommentSchema);
    } catch (err) {
        sendResponse(res, {
            statusCode: 400,
            message: err.message,
        });
        return;
    }

    const { id: postId, } = req.params;

    const postFileData = readPostsData();
    const commentFileData = readCommentsData();

    const postData = postFileData[postId];

    const commentId = uuid.v4();
    const addedAt = Date.now();

    // add comment per user
    if (postData.comments[userId]) {
        postData.comments[userId][commentId] = addedAt;
    } else {
        postData.comments[userId] = {
            [commentId]: addedAt,
        };
    }

    commentFileData[commentId] = body;

    // generate data
    body.userId = userId;
    body.time = addedAt;
    body.postId = postId;

    writePostsData(postFileData);
    writeCommentsData(commentFileData);

    sendResponse(res, {
        statusCode: 200,
        message: CommentAdded,
    });
}

module.exports = {
    createPost,
    likePost,
    commentPost,
};
