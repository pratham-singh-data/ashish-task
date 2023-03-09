const Joi = require(`joi`);

const createPostSchema = Joi.object({
    data: Joi.string().min(1).required(),
});

module.exports = {
    createPostSchema,
};
