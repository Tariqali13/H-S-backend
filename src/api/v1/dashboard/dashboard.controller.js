const appRoot = require('app-root-path');
const Video = require(appRoot + '/src/models/video');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const User = require(appRoot + '/src/models/user');
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
            const totalVideos = await Video.countDocuments({ is_deleted: false, type: 'video' });
            const totalEmployees = await User.countDocuments({});
            const employeeProgress = await EmployeeProgress.findOne({ employee_id: user_id })
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
                totalVideos,
                totalEmployees,
                bookingArray,
                employeeProgress,
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
