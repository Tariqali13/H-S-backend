const appRoot = require('app-root-path');
const Booking = require(appRoot + '/src/models/booking');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;
const bookingUtil = require('./util');

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('pricing_plan');
        return res.status(status.success).json({
            message: 'Booking found Successfully.',
            data: booking,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const { records_per_page, page_no } = req.query;
        const query = await bookingUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const bookings = await Booking.find(query).populate('pricing_plan').populate('created_by').limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfBookings = await Booking.countDocuments(query)
        return res.status(status.success).json({
            message: 'Bookings found Successfully.',
            data: bookings,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_bookings: totalNumberOfBookings,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createBooking = async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        return res.status(status.success).json({
            message: 'Booking Created Successfully.',
            data: booking,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Booking Updated Successfully.',
            data: booking,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Booking deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}