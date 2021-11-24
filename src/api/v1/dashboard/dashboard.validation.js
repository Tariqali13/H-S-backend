const Joi = require('joi');
const appRoot = require('app-root-path');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status } = appConstants;

const validateGetDashboardStats = async (req, res, next) => {
    try {
        const schema = Joi.object({
            user_id: Joi.string().required(),
        });
        await schema.validateAsync(req.query, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        console.log(err);
        return res.status(status.errorValidation).json({message: err["details"][0]["message"]});
    }
};

const validateGetDashboardCustomerGrowth = async (req, res, next) => {
    try {
        const schema = Joi.object({
            user_id: Joi.string().required(),
            filter: Joi.string().optional(),
        });
        await schema.validateAsync(req.query, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        console.log(err);
        return res.status(status.errorValidation).json({message: err["details"][0]["message"]});
    }
};


module.exports = {
    validateGetDashboardStats,
    validateGetDashboardCustomerGrowth,
}