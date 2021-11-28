const moment = require('moment')

module.exports = {
    // In this method we will build query to get events
    buildQuery: async (params) => {
        try {
            let query = {};
            if (params.full_name) {
                query = {
                    ...query,
                    full_name: {$regex: params.full_name.trim(), $options: 'i'},
                };
            }
            if (params.email) {
                query = {
                    ...query,
                    email: {$regex: params.email.trim(), $options: 'i'},
                };
            }
            if (params.product_id) {
                query = {
                    ...query,
                    product_id: params.product_id,
                };
            }
            if (params.city || params.state || params.address) {
                const orCondition = []
                if (params.address) {
                    orCondition.push({address: {$regex: new RegExp("^" + params.address.toLowerCase(), "i")}})
                }
                if (params.city) {
                    orCondition.push({city: {$regex: new RegExp("^" + params.city.toLowerCase(), "i")}})
                }
                if (params.state) {
                    orCondition.push({state: {$regex: new RegExp("^" + params.state.toLowerCase(), "i")}})
                }
                query = {
                    ...query,
                    $or: orCondition,
                };
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

}