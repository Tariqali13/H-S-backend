const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;


const validateGetEmployeeProgressById = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.string().required(),
        })
        await schema.validateAsync(req.params);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};


const validateCreateProgress = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            employee_id: Joi.string().required(),
            video_id: Joi.string().required(),
            created_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

module.exports = {
    validateGetEmployeeProgressById,
    validateCreateProgress,
}