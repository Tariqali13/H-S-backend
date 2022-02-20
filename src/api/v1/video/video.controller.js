const appRoot = require('app-root-path');
const Video = require(appRoot + '/src/models/video');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const appConstants = require(appRoot + '/src/constants/app-constants');
const StorageFile = require(appRoot + '/src/models/storage-file');
const {status, messages} = appConstants;
const VideoUtil = require('./util');
const commonUtil = require(appRoot + '/src/utils/common-util');
const orderByUtil = commonUtil.orderBy();

exports.getVideoById = async (req, res) => {
    try {
        const {id} = req.params;
        const video = await Video.findById(id).populate('created_by').populate('image_id').populate("video_id");
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
        const {records_per_page = 0, page_no = 1, type = 'video', is_parent_folder = false} = req.query;
        const query = await VideoUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        let videos = await Video.find(query).populate('created_by').populate('image_id').populate("video_id").limit(Number(records_per_page)).skip(skipDocuments).sort({order_by: 1});
        const totalNumberOfVideos = await Video.countDocuments(query)
        if (totalNumberOfVideos > 0) {
            if (videos.length) {
                for (const f of videos) {
                    if (f.type === 'folder') {
                        f.total_videos = await Video.countDocuments({folder_id: f._id, type: 'video'}) || 0;
                        f.total_folders = await Video.countDocuments({folder_id: f._id, type: 'folder'}) || 0;
                    }
                }
            }
        }
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
        const {folder_id} = req.body;
        let query = {};
        if (folder_id) {
            query = {
                folder_id: folder_id,
            }
        } else {
            query = {
                folder_id: {$exists: false},
            }
        }
        req.body.order_by = await orderByUtil.getOrder(Video, query);
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
        const {videos_data = [], is_blocked = false, unblock_after, title, type, image_id, parent_count, folder_id, description, created_by} = req.body;
        const videos = [];
        let query = {};
        if (folder_id) {
            query = {
                folder_id: folder_id,
            }
        } else {
            query = {
                folder_id: {$exists: false},
            }
        }
        if (videos_data.length) {
            for (const video of videos_data) {
                const orderBy = await orderByUtil.getOrder(Video, query)
                const dataToSave = {
                    video_id: video,
                    title: title,
                    image_id: image_id,
                    folder_id: folder_id,
                    description: description,
                    order_by: orderBy,
                    type: type,
                    parent_count: parent_count,
                    is_blocked: is_blocked,
                    unblock_after: unblock_after,
                    created_by: created_by,
                }
                let newVideo = await Video.create(dataToSave);
                videos.push(newVideo);
            }
        } else {
            const orderBy = await orderByUtil.getOrder(Video, query)
            const dataToSave = {
                title: title,
                image_id: image_id,
                folder_id: folder_id,
                description: description,
                order_by: orderBy,
                type: type,
                parent_count: parent_count,
                is_blocked: is_blocked,
                unblock_after: unblock_after,
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
        const {id} = req.params;
        const video = await Video.findByIdAndUpdate({_id: id}, req.body, {new: true});
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
        const {id} = req.params;
        const findVideo = await Video.findById(id);
        if (findVideo.type === 'video') {
            if (findVideo.video_id) {
                await StorageFile.findByIdAndUpdate({_id: findVideo.video_id}, {
                    schedule_to_delete: true,
                    is_deleted: true
                }, {new: true});
                const updateDataProgress = {
                    $pull: {video_ids: findVideo.video_id}
                }
                await EmployeeProgress.updateMany({}, updateDataProgress);
            }
           if (findVideo.image_id) {
               await StorageFile.findByIdAndUpdate({_id: findVideo.image_id}, {
                   schedule_to_delete: true,
                   is_deleted: true
               }, {new: true});
           }
            await Video.deleteOne({_id: id});
            return res.status(status.success).json({
                message: 'Video / Folder deleted Successfully.',
            });
        } else {
            const maxParent = await Video.findOne().sort({parent_count: -1}).limit(1);
            let video = findVideo;
            let folderIds = [];
            if (findVideo._id) {
                folderIds.push(findVideo._id);
            }
            for (let i = findVideo.parent_count; i <= maxParent.parent_count; i++) {
                if (video && video._id) {
                    video = await Video.find({folder_id: video._id, type: 'folder'}).distinct('_id');
                    if (video && video.length) {
                        folderIds = folderIds.concat(video);
                    }
                }
            }
            for (const vid of folderIds) {
                let videoFound = await Video.findOne({_id: vid});
                if (videoFound) {
                    if (videoFound.image_id) {
                        await StorageFile.findByIdAndUpdate({_id: videoFound.image_id}, {
                            schedule_to_delete: true,
                            is_deleted: true
                        }, {new: true});
                    }
                    let findVideos = await Video.find({folder_id: vid, type: 'video'});
                    if (findVideos.length) {
                        for (const v of findVideos) {
                            if (v.video_id) {
                                await StorageFile.findByIdAndUpdate({$in: {_id: v.video_id}}, {
                                    schedule_to_delete: true,
                                    is_deleted: true,
                                }, {new: true});
                                const updateDataProgress = {
                                    $pull: {video_ids: v.video_id}
                                }
                                await EmployeeProgress.updateMany({}, updateDataProgress);
                            }
                            if (v.image_id) {
                                await StorageFile.findByIdAndUpdate({$in: {_id: v.image_id}}, {
                                    schedule_to_delete: true,
                                    is_deleted: true,
                                }, {new: true});
                            }
                            await Video.deleteOne({_id: v._id});
                        }

                    }
                }
                await Video.deleteOne({_id: vid});
            }
            return res.status(status.success).json({
                message: 'Video / Folder deleted Successfully.',
            });
        }
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}