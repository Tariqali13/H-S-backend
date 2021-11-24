const moment = require('moment')

module.exports = {
    // In this method we will build query to get events
    buildQuery: async (params) => {
        try {
            let query = {};
            if (params.email) {
                query = {
                    ...query,
                    email: {$regex: params.email.trim(), $options: 'i'},
                };
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

}