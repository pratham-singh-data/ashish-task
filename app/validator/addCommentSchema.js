const Joi = require(`joi`);

const addCommentSchema = Joi.object({
    data: Joi.string().min(1).required(),
});

module.exports = {
    addCommentSchema,
};
