const moment = require('moment')

module.exports = {
    // In this method we will build query to get events
    buildQuery: async (params) => {
        try {
            let query = {};
            if (params.title) {
                query = {
                    ...query,
                    title: {$regex: params.title.trim(), $options: 'i'},
                };
            }
            if (params.testimonial_by_name) {
                query = {
                    ...query,
                    testimonial_by_name: {$regex: params.testimonial_by_name.trim(), $options: 'i'},
                };
            }
            if (params.is_top_review) {
                console.log("params.is_top_review working tru", params.is_top_review)
                query = {
                    ...query,
                    is_top_review: params.is_top_review,
                };
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

}