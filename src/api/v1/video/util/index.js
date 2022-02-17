const appRoot = require('app-root-path');
const Video = require(appRoot + '/src/models/video');

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
            if (params.type) {
                query = {
                    ...query,
                    type: params.type,
                }
            }
            if (params.is_parent_folder) {
                query = {
                    ...query,
                    folder_id: {$exists: false}
                }
            }
            return query;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    repositionVideoByValue: function (folderId, index, newValue) {
        return new Promise(async function (resolve, reject) {
            let data = {}
            if (folderId) {
                data = await Video.findOne({
                    folder_id: folderId,
                    order_by: index,
                });
            } else {
                data = await Video.findOne({
                    folder_id: {$exists: false},
                    order_by: index,
                });
            }
            if (data) {
                const values = {
                    id: data._id,
                    nextOrderBy: newValue,
                };
                resolve(values);
            } else {
                resolve([]);
            }
        });
    },

}