/**
 * Function to send server response.
 * @param {Response} res express response object.
 * @param {object} data data to send in response
 */
function sendResponse(res, data) {
    res.statusCode = data.statusCode;
    res.json(data);
}

module.exports = {
    sendResponse,
};
