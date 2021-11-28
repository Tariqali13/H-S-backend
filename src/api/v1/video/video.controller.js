const appRoot = require('app-root-path');
const Video = require(appRoot + '/src/models/video');
const appConstants = require(appRoot + '/src/constants/app-constants');
const StorageFile = require(appRoot + '/src/models/storage-file');
const { status, messages } = appConstants;
const VideoUtil = require('./util');

exports.getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate('created_by').populate("video_id");
        return res.status(status.success).json({
            message: 'Video found Successfully.',
            data: video,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllVideo = async (req, res) => {
    try {
        const { records_per_page = 0, page_no = 1} = req.query;
        const query = await VideoUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const videos = await Video.find(query).populate('created_by').populate("video_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfVideos = await Video.countDocuments(query)
        return res.status(status.success).json({
            message: 'Videos found Successfully.',
            data: videos,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_videos: totalNumberOfVideos,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getVideoCount = async (req, res) => {
    try {
        const totalNumberOfVideos = await Video.countDocuments({})
        return res.status(status.success).json({
            message: 'Total Videos found Successfully.',
            data: totalNumberOfVideos,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}


exports.createVideo = async (req, res) => {
    try {
        const video = await Video.create(req.body);
        return res.status(status.success).json({
            message: 'Video Created Successfully.',
            data: video,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createVideoMultiple = async (req, res) => {
    try {
        const { videos_data = [], title, description, created_by } = req.body;
        const videos = [];
        for (const video of videos_data) {
            const dataToSave = {
                video_id: video,
                title: title,
                description: description,
                created_by: created_by,
            }
            let newVideo = await Video.create(dataToSave);
            videos.push(newVideo);
        }
        return res.status(status.success).json({
            message: 'videos Created Successfully.',
            data: videos,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}


exports.updateVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Video Updated Successfully.',
            data: video,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const findVideo = Video.findById(id);
        await StorageFile.findByIdAndUpdate({ _id: findVideo.video_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        await Video.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Video deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}