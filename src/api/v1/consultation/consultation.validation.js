const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

const validateGetConsultationById = async (req, res, next) => {
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

const validateGetAllConsultations = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            page_no: Joi.number().optional(),
            records_per_page: Joi.number().optional(),
            full_name: Joi.string().optional().allow(''),
            email: Joi.string().optional().allow(''),
            first_name: Joi.string().optional().allow(''),
            last_name: Joi.string().optional().allow(''),
            city: Joi.string().optional().allow(''),
            state: Joi.string().optional().allow(''),
            address: Joi.string().optional().allow(''),
         })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};


const validateCreateConsultation = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            address: Joi.string().required(),
            bill_range: Joi.string().required(),
            credit_score: Joi.boolean().required(),
            booking_type: Joi.string().required(),
            phone_number: Joi.string().optional().allow(""),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

const validateDeleteConsultationById = async (req, res, next) => {
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
    validateGetConsultationById,
    validateGetAllConsultations,
    validateCreateConsultation,
    validateDeleteConsultationById,
}