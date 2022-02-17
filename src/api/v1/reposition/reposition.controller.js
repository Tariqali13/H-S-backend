const appRoot = require('app-root-path');
const repositionUtil = require('./util/reposition.util');

exports.repositionData = async (req, res) => {
    try {
        const {
            desired_location,
            direction,
            folder_id,
            videoId,
        } = req.body;
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
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
            error: error
        });
    }
}
