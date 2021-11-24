const moment = require('moment');

module.exports = {
    // In this method we will convert dates in to array
    dateRange: async function (startDate, endDate) {
        let dates = [];
        for (dates, date = new Date(startDate); date < new Date(endDate); date.setMonth(date.getMonth() + 1)) {
            dates.push(new Date(date));
        }
        return dates;
    },

    dateRangeWeekly: async function (startDate, endDate) {
        let dates = [];
        for (dates, date = new Date(startDate); date < new Date(endDate); date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }
        return dates;
    }

}
