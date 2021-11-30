const appRoot = require('app-root-path');
const User = require(appRoot + '/src/models/user');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateUser = async (req, res, next) => {
    try {
        let userId;
        if (_get(req, 'body._id')) {
            userId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            userId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            userId = _get(req, 'query.id')
        }
        if (userId) {
            const userToFind = await User.findById(userId);
            if (!userToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find User for the requested ID`
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


// In this method we will validate user with email
exports.validateUserWithEmail = async (req, res, next) => {
    try {
        let email;
        if (_get(req, 'body.email')) {
            email = _get(req, 'body.email')
        }
        if (email) {
            const userToFind = await User.findOne({email:
                    { $regex: new RegExp("^" + email.toLowerCase(), "i") }
            });
            if (userToFind && !userToFind?.is_admin) {
                return res.status(status.duplicateRecord).json({
                    message: 'This email already in use. Please check and try again'
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
