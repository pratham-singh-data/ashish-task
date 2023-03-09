const { readUsersData,
    readPostsData,
    writePostsData,
    writeUsersData,
    readCommentsData,
    writeCommentsData, } = require('../helper');
const { InvalidToken,
    PostSuccessfullyAdded,
    NonExistentPost,
    LikeRegisterred,
    CommentAdded, } = require('../util/messages');
const { sendResponse, } = require('../util/sendResponse');
const jwt = require(`jsonwebtoken`);
const { SECRETKEY, } = require('../../config');
const Joi = require(`joi`);
const uuid = require(`uuid`);
const { addCommentSchema,
    createPostSchema, } = require('../validator');

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

    body.likes = [];
    body.likeCount = 0;
    body.comments = {};
    body.userId = userId;

    writePostsData(postFileData);
    writeUsersData(userFileData);

    sendResponse(res, {
        statusCode: 200,
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

    const { id: postId, } = req.params;

    // check that post exists
    if (! postFileData[postId]) {
        sendResponse(res, {
            statusCode: 403,
            message: NonExistentPost,
        });
        return;
    }

    const postData = postFileData[postId];
    const userIndex = postData.likes.indexOf(userId);

    if (userIndex === -1) {
        postData.likeCount++;
        postData.likes.push(userId);
    } else {
        postData.likeCount--;
        postData.likes.splice(userIndex, 1);
    }

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

/**
 * Middleware to fetch all posts
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 * @param {Function} next express next function
 */
function getPost(req, res, next) {
    if (req.originalUrl.indexOf(`/?id=`) === -1) {
        next();
        return;
    }

    const idToDisplay = req.
        originalUrl.
        slice(req.originalUrl.indexOf(`/?id=`) + 5);


    const postFileData = readPostsData();
    const commentFileData = readCommentsData();

    const dataToDisplay = postFileData[idToDisplay];
    dataToDisplay.commentsData = [];

    for (const commentObj of Object.values(dataToDisplay.comments)) {
        for (const commentKey of Object.keys(commentObj)) {
            dataToDisplay.commentsData.push(commentFileData[commentKey]);
        }
    }

    sendResponse(res, {
        statusCode: 200,
        data: dataToDisplay,
    });
}

/**
 * Middleware to fetch all posts
 * @param {Request} req express request object.
 * @param {Response} res express response object.
 */
function getAllPost(req, res) {
    const dataToDisplay = [];

    const postFileData = readPostsData();
    const commentFileData = readCommentsData();

    for (const post of Object.values(postFileData)) {
        const postData = post;
        postData.commentsData = [];

        for (const commentObj of Object.values(postData.comments)) {
            for (const commentKey of Object.keys(commentObj)) {
                postData.commentsData.push(commentFileData[commentKey]);
            }
        }

        dataToDisplay.push(postData);
    }

    sendResponse(res, {
        statusCode: 200,
        data: dataToDisplay,
    });
}

module.exports = {
    createPost,
    likePost,
    commentPost,
    getPost,
    getAllPost,
};
