const appRoot = require('app-root-path');
const Folder = require(appRoot + '/src/models/folder');
const Video = require(appRoot + '/src/models/video');
const appConstants = require(appRoot + '/src/constants/app-constants');
const StorageFile = require(appRoot + '/src/models/storage-file');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const { status, messages } = appConstants;
const folderUtil = require('./util');

exports.getFolderById = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await Folder.findById(id).populate("image_id");
        return res.status(status.success).json({
            message: 'Folder found Successfully.',
            data: folder,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllFolder = async (req, res) => {
    try {
        const { records_per_page = 0, page_no = 1} = req.query;
        const query = await folderUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        let folders = await Folder.find(query).populate("image_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        if (folders.length) {
            for (const f of folders) {
                f.total_videos = await Video.countDocuments({ folder_id: f._id});
            }
        }
        const totalNumberOfFolders = await Folder.countDocuments(query)
        return res.status(status.success).json({
            message: 'Folders found Successfully.',
            data: folders,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_folders: totalNumberOfFolders,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}


exports.createFolder = async (req, res) => {
    try {
        const folder = await Folder.create(req.body);
        return res.status(status.success).json({
            message: 'Folder Created Successfully.',
            data: folder,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateFolderById = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await Folder.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Folder Updated Successfully.',
            data: folder,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteFolderById = async (req, res) => {
    try {
        const { id } = req.params;
        const findFolder = await Folder.findById(id);
        const findVideos = await Video.find({ folder_id: findFolder._id }).distinct('video_id');
        await StorageFile.findByIdAndUpdate({ _id: findFolder.image_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        await StorageFile.findByIdAndUpdate({$in: { _id: findVideos }}, { schedule_to_delete: true, is_deleted: true }, { new: true })
        const updateDataProgress = {
            $pull: { video_ids: findVideos }
        }
        await EmployeeProgress.updateMany({}, updateDataProgress);
        await Folder.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Folder deleted Successfully.',
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}