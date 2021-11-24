const appRoot = require('app-root-path');
const Contact = require(appRoot + '/src/models/contact');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateContact = async (req, res, next) => {
    try {
        let contactId;
        if (_get(req, 'body._id')) {
            contactId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            contactId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            contactId = _get(req, 'query.id')
        }
        if (contactId) {
            const contactToFind = await Contact.findById(contactId);
            if (!contactToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Contact for the requested ID`
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