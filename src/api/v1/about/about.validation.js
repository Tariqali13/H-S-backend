const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;


const validateGetAbout = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            type: Joi.string().optional(),
        })
        await schema.validateAsync(req.query);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

const validateUpdateAbout = async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            heading: Joi.string().required(),
            description: Joi.string().required(),
            image_id: Joi.string().required(),
            type: Joi.string().required(),
            updated_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

module.exports = {
    validateGetAbout,
    validateUpdateAbout,
}