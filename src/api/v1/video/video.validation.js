const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

const validateGetVideoById = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
        });
        await schema.validateAsync(req.params, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
};

const validateGetAllVideo = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            page_no: Joi.number().optional(),
            records_per_page: Joi.number().optional(),
            title: Joi.string().optional().allow(''),
            folder_id: Joi.string().optional().allow(''),
            type: Joi.string().optional().allow(''),
            is_parent_folder: Joi.boolean().optional(),
         })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};


const validateCreateVideo = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().optional(),
            video_id: Joi.string().optional(),
            folder_id: Joi.string().optional().allow(''),
            image_id: Joi.string().optional(),
            type: Joi.string().optional(),
            parent_count: Joi.number().required(),
            is_blocked: Joi.boolean().required(),
            unblock_after: Joi.string().optional(),
            created_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

const validateCreateVideoMultiple = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            videos_data: Joi.array().optional(),
            title: Joi.string().required(),
            description: Joi.string().optional(),
            folder_id: Joi.string().optional().allow(''),
            image_id: Joi.string().optional(),
            type: Joi.string().optional(),
            parent_count: Joi.number().required(),
            is_blocked: Joi.boolean().required(),
            unblock_after: Joi.string().optional(),
            created_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};



const validateUpdateVideo = async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            title: Joi.string().required(),
            video_id: Joi.string().optional(),
            description: Joi.string().optional(),
            folder_id: Joi.string().optional().allow(''),
            image_id: Joi.string().optional(),
            type: Joi.string().optional(),
            is_blocked: Joi.boolean().required(),
            unblock_after: Joi.string().optional(),
            updated_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

const validateDeleteVideoById = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
        });
        await schema.validateAsync(req.params, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        return res.status(status.validationError).json({message: err["details"][0]["message"]});
    }
};

module.exports = {
    validateGetVideoById,
    validateGetAllVideo,
    validateUpdateVideo,
    validateCreateVideo,
    validateDeleteVideoById,
    validateCreateVideoMultiple,
}