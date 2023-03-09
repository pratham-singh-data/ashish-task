const { tokenCleanup, } = require(`./tokenCleanup`);
const { readTokensData,
    writeTokensData,
    readCommentsData,
    writeCommentsData,
    readUsersData,
    writeUsersData,
    readPostsData,
    writePostsData, } = require(`./fileManipulators`);

module.exports = {
    tokenCleanup,
    readTokensData,
    writeTokensData,
    readCommentsData,
    writeCommentsData,
    readUsersData,
    writeUsersData,
    readPostsData,
    writePostsData,
};
