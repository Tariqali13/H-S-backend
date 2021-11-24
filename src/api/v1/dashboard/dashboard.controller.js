const appRoot = require('app-root-path');
const Gallery = require(appRoot + '/src/models/gallery');
const Subscribtions = require(appRoot + '/src/models/subscribtion');
const Bookings = require(appRoot + '/src/models/booking');
const appConstants = require(appRoot + '/src/constants/app-constants');
const {status, messages} = appConstants;
const moment = require('moment')
const datesArrayUtil = require('./util/stats-common-util/date-range');
const dashboardCommonUtil = require('./util/stats-common-util/format-date');

class DashboardController {

    getAdminDashboardStats = async (req, res) => {
        try {
            const {user_id} = req.query;
            const startOfDate = moment().startOf('month').toString()
            const endOfDate = moment().endOf('month').toString()
            const query = {
                createdAt: {$gte: startOfDate, $lte: endOfDate}
            };
            const totalBookings = await Bookings.countDocuments(query);
            const totalImages = await Gallery.countDocuments({ ...query, is_deleted: false });
            const totalSubscribtions = await Subscribtions.countDocuments(query);
            let bookingArray = [];
            const startYear = moment(new Date()).startOf('year')
            const endYear = moment(new Date()).endOf('year')
            const dates = await datesArrayUtil.dateRange(startYear, endYear);
            const getBookings = dates.map(async (date) => {
                const finishDate = moment(date).endOf('month')
                const bookings = await Bookings.find({
                   createdAt: { $gte: date, $lte: finishDate }
                });
                const formateDate = await dashboardCommonUtil.formatDate(date);
                const dailyUser = {}
                dailyUser.x = formateDate;
                dailyUser.y = bookings;
                return dailyUser;
            });
            bookingArray = await Promise.all(getBookings);
            const dataToReturn = {
                totalBookings,
                totalImages,
                totalSubscribtions,
                bookingArray,
            }
            return res.status(status.success).json({
                message: 'Stats found Successfully.',
                data: dataToReturn,
            });
        } catch (err) {
            console.log(err);
            return res.status(status.serverError).json({
                message: messages.serverErrorMessage
            });
        }
    }
}


module.exports = new DashboardController();
