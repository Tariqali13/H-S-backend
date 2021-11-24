const appRoot = require('app-root-path');
const Testimonial = require(appRoot + '/src/models/testimonial');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateTestimonial = async (req, res, next) => {
    try {
        let testimonialId;
        if (_get(req, 'body._id')) {
            testimonialId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            testimonialId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            testimonialId = _get(req, 'query.id')
        }
        if (testimonialId) {
            const testimonialToFind = await Testimonial.findById(testimonialId);
            if (!testimonialToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Testimonial for the requested ID`
                });
            }
        }
        next();
    } catch (error) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage,
            error
        });
    }
}