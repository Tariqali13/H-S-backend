const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

const validateLogin = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().max(255).required(),
            password: Joi.string().max(255).required()
        });
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
};

const validateUpdatePassword = async (req, res, next) => {
    try {
        const schema = Joi.object({
            old_password: Joi.string().optional().allow(null, ''),
            password: Joi.string().required(),
        });
        await schema.validateAsync(req.body);
        return next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
}

module.exports = {
    validateLogin,
    validateUpdatePassword
}