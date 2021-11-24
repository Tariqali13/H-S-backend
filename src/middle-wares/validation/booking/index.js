const appRoot = require('app-root-path');
const Booking = require(appRoot + '/src/models/booking');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateBooking = async (req, res, next) => {
    try {
        let bookingId;
        if (_get(req, 'body._id')) {
            bookingId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            bookingId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            bookingId = _get(req, 'query.id')
        }
        if (bookingId) {
            const bookingToFind = await Booking.findById(bookingId);
            if (!bookingToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find booking for the requested ID`
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