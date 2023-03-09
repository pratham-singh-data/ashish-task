const { addCommentSchema, } = require(`./addCommentSchema`);
const { createPostSchema, } = require(`./createPostSchema`);
const { userLoginSchema, } = require(`./userLoginSchema`);
const { userRegistrationSchema, } = require(`./userRegistrationSchema`);

module.exports = {
    addCommentSchema,
    createPostSchema,
    userLoginSchema,
    userRegistrationSchema,
};
