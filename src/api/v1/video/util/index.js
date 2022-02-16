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
            if (params.folder_id) {
                query = {
                    ...query,
                    folder_id: params.folder_id,
                }
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

}