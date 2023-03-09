const { readFileSync, writeFileSync, } = require(`fs`);

const USERSFILEURL = `./database/users.json`;
const POSTSFILEURL = `./database/posts.json`;
const COMMENTSFILEURL = `./database/comments.json`;
const TOKENSFILEURL = `./database/tokens.json`;

/**
 * Reads file at given URL
 * @param {string} url url of file to read
 * @return {string} parsed data in file
 */
function readFile(url) {
    return JSON.parse(readFileSync(url));
}

/**
 * Write data into file at given URL
 * @param {string} url url of file to read
 * @param {object} data Data to write into file
 */
function writeFile(url, data) {
    writeFileSync(url, JSON.stringify(data));
}

/**
 * Reads file of tokens database file
 * @return {string} parsed data in tokens file
 */
function readTokensData() {
    return readFile(TOKENSFILEURL);
}

/**
 * Writes data into tokens database file
 * @param {object} data Data to write into file
 */
function writeTokensData(data) {
    writeFile(TOKENSFILEURL, data);
}

/**
 * Reads file of comments database file
 * @return {string} parsed data in comments file
 */
function readCommentsData() {
    return readFile(COMMENTSFILEURL);
}

/**
 * Writes data into comments database file
 * @param {object} data Data to write into file
 */
function writeCommentsData(data) {
    writeFile(COMMENTSFILEURL, data);
}

/**
 * Reads file of users database file
 * @return {string} parsed data in users file
 */
function readUsersData() {
    return readFile(USERSFILEURL);
}

/**
 * Writes data into users database file
 * @param {object} data Data to write into file
 */
function writeUsersData(data) {
    writeFile(USERSFILEURL, data);
}

/**
 * Reads file of posts database file
 * @return {string} parsed data in posts file
 */
function readPostsData() {
    return readFile(POSTSFILEURL);
}

/**
 * Writes data into posts database file
 * @param {object} data Data to write into file
 */
function writePostsData(data) {
    writeFile(POSTSFILEURL, data);
}

module.exports = {
    readTokensData,
    writeTokensData,
    readCommentsData,
    writeCommentsData,
    readUsersData,
    writeUsersData,
    readPostsData,
    writePostsData,
};
