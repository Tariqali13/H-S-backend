const appRoot = require('app-root-path');
const Consultation = require(appRoot + '/src/models/consultation');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate consultation

exports.validateConsultation = async (req, res, next) => {
    try {
        let consultationId;
        if (_get(req, 'body._id')) {
            consultationId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            consultationId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            consultationId = _get(req, 'query.id')
        }
        if (consultationId) {
            const consultationToFind = await Consultation.findById(consultationId);
            if (!consultationToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Consultation for the requested ID`
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