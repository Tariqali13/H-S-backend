const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

const validateGetBookingById = async (req, res, next) => {
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

const validateGetAllBookings = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            page_no: Joi.number().optional(),
            records_per_page: Joi.number().optional(),
            full_name: Joi.string().max(255).optional().allow(''),
            email: Joi.string().max(255).optional().allow(''),
            state: Joi.string().optional().allow(''),
            city: Joi.string().optional().allow(''),
            address: Joi.string().optional().allow(''),
            product_id: Joi.string().optional().allow(''),
         })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};


const validateCreateBooking = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            full_name: Joi.string().max(255).required(),
            email: Joi.string().max(255).required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            phone_number: Joi.string().optional().allow(""),
            product_id: Joi.string().optional().allow(''),
            bill_range: Joi.string().required(),
            credit_score: Joi.boolean().required(),
            created_by: Joi.string().optional().allow(''),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};



const validateUpdateBooking = async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            full_name: Joi.string().max(255).required(),
            email: Joi.string().max(255).required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            phone_number: Joi.string().optional().allow(""),
            bill_range: Joi.string().required(),
            credit_score: Joi.boolean().required(),
            product_id: Joi.string().optional().allow(''),
            updated_by: Joi.string().required(),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(status.validationError).json({message: error["details"][0]["message"]})
    }
};

const validateDeleteBookingById = async (req, res, next) => {
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
    validateGetBookingById,
    validateGetAllBookings,
    validateUpdateBooking,
    validateCreateBooking,
    validateDeleteBookingById,
}