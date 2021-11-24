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
            if (params.pricing_plan) {
                query = {
                    ...query,
                    pricing_plan: params.pricing_plan,
                };
            }
            if (params.event_date) {
                const startOfDate = moment(params.event_date).startOf('day').toString()
                const endOfDate = moment(params.event_date).endOf('day').toString()
                query = {
                    ...query,
                    event_date: {$gte: startOfDate, $lte: endOfDate}
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