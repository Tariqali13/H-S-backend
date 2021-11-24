const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const bookingValidations = require('./booking.validation');
const bookingController = require('./booking.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const bookingMiddleware = require(appRoot + '/src/middle-wares/validation/booking');


router.get(
    '/all-bookings',
    [jwtValidations, bookingValidations.validateGetAllBookings],
    bookingController.getAllBookings
);

router.get(
    '/:id',
    [jwtValidations, bookingMiddleware.validateBooking, bookingValidations.validateGetBookingById],
    bookingController.getBookingById
);

router.post(
    '/',
    [jwtValidations, bookingValidations.validateCreateBooking],
    bookingController.createBooking
);

router.patch(
    '/:id',
    [jwtValidations, bookingMiddleware.validateBooking, bookingValidations.validateUpdateBooking],
    bookingController.updateBookingById
);

router.delete(
    '/:id',
    [jwtValidations, bookingMiddleware.validateBooking, bookingValidations.validateDeleteBookingById],
    bookingController.deleteBookingById
);


module.exports = router;
