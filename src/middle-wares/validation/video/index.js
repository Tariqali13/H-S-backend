const appRoot = require('app-root-path');
const Video = require(appRoot + '/src/models/video');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateVideo = async (req, res, next) => {
    try {
        let videoId;
        if (_get(req, 'body._id')) {
            videoId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            videoId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            videoId = _get(req, 'query.id')
        }
        if (videoId) {
            const videoToFind = await Video.findById(videoId);
            if (!videoToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Video for the requested ID`
                });
            }
        }
        next();
    } catch (error) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage,
            error
        });
    }
}