const Joi = require(`joi`);

const userLoginSchema = Joi.object({
    password: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
});

module.exports = {
    userLoginSchema,
};
