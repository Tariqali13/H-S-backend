const moment = require('moment');

module.exports = {
// In this method we will format date
    formatDate: async function (date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const formateDate = month + '/' + day + '/' + year;
        return formateDate
    },
}

