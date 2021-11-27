const moment = require('moment')

module.exports = {
    // In this method we will build query to get events
    buildQuery: async (params) => {
        try {
            let query = {};
            if (params.first_name) {
                query = {
                    ...query,
                    first_name: {$regex: params.first_name.trim(), $options: 'i'},
                };
            }
            if (params.last_name) {
                query = {
                    ...query,
                    last_name: {$regex: params.last_name.trim(), $options: 'i'},
                };
            }
            if (params.email) {
                query = {
                    ...query,
                    email: {$regex: params.email.trim(), $options: 'i'},
                };
            }
            if (params.is_admin) {
                query = {
                    ...query,
                    is_admin: params.is_admin,
                };
            }
            if (params.is_active) {
                query = {
                    ...query,
                    is_active: params.is_active,
                };
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

}