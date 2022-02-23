const appRoot = require('app-root-path');
const repositionUtil = require('./util/reposition.util');
const Video = require(appRoot + '/src/models/video');
const commonUtil = require(appRoot + '/src/utils/common-util');
const orderByUtil = commonUtil.orderBy();

exports.repositionData = async (req, res) => {
    try {
        let {
            other_folder,
            other_folder_id,
            desired_location,
            direction,
            folder_id,
            videoId,
        } = req.body;
        if (other_folder) {
            let query = {};
            if (folder_id) {
                query = {
                    folder_id: folder_id,
                }
            } else {
                query = {
                    folder_id: { $exists: false },
                }
            }
            const orderBy = await orderByUtil.getOrder(Video, query);
            let addVideo = await Video.findByIdAndUpdate({ _id: videoId }, { folder_id: other_folder_id, order_by: orderBy }, { new: true });
            if (desired_location) {
                if (desired_location > addVideo.order_by) {
                    direction = 'right';
                }
                if (desired_location < addVideo.order_by) {
                    direction = 'left';
                }
                const sortData = await repositionUtil.repositionVideosFolders(
                    folder_id,
                    videoId,
                    desired_location,
                    direction
                );
                if (sortData) {
                    return res.status(200).json({
                        message: 'Data has been sorted successfully.'
                    });
                } else {
                    return res.status(400).json({
                        message: 'Data could not be sorted right now. Please check and try again.',
                    });
                }
            }
        }
        if (!other_folder) {
            const sortData = await repositionUtil.repositionVideosFolders(
                folder_id,
                videoId,
                desired_location,
                direction
            );
            if (sortData) {
                return res.status(200).json({
                    message: 'Data has been sorted successfully.'
                });
            } else {
                return res.status(400).json({
                    message: 'Data could not be sorted right now. Please check and try again.',
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
            error: error
        });
    }
}
