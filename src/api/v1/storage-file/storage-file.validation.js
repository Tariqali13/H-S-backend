const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const {status, messages} = appConstants;

const validateAddStorageFileData = async (req, res, next) => {
    try {
        const schema = Joi.object({
            file_name: Joi.string().required(),
            file_type: Joi.string().required(),
            file_url: Joi.string().required(),
            schedule_to_delete: Joi.string().optional().allow(''),
            created_by: Joi.string().required().optional().allow(''),
            original_name: Joi.string().optional().allow(''),
            file_size: Joi.number().required(),
        });
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
};

const validateAddMultiStorageFileData = async (req, res, next) => {
    try {
        const schema = Joi.object({
            pictures_data: Joi.array().min(1).required(),
        });
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
};

module.exports = {
    validateAddStorageFileData,
    validateAddMultiStorageFileData,
}