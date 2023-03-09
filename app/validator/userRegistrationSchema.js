const Joi = require(`joi`);

const userRegistrationSchema = Joi.object({
    username: Joi.string().min(1).alphanum().required(),
    password: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
});

module.exports = {
    userRegistrationSchema,
};
