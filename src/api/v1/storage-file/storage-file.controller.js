const appRoot = require('app-root-path');
const StorageFile = require(appRoot + '/src/models/storage-file');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

exports.getStorageFileById = async (req, res) => {
	try {
		const { id } = req.params;
		const storageFile = await StorageFile.findById(id).populate('created_by');
		return res.status(status.success).json({
			message: 'Storage File found Successfully.',
			data: storageFile,
		});
	} catch (err) {
		return res.status(status.serverError).json({
			message: messages.serverErrorMessage
		});
	}
}

exports.createStorageFile = async (req, res) => {
	try {
		const storageFile = await StorageFile.create(req.body);
		return res.status(status.success).json({
			message: 'Storage File has been created successfully.',
			data: storageFile,
		});
	} catch (err) {
		return res.status(status.serverError).json({
			message: messages.serverErrorMessage
		});
	}
}

exports.createStorageFileMultiple = async (req, res) => {
	try {
		const storageFiles = await StorageFile.insertMany(req.body.pictures_data);
		return res.status(status.success).json({
			message: 'Storage Files has been created successfully.',
			data: storageFiles,
		});
	} catch (err) {
		return res.status(status.serverError).json({
			message: messages.serverErrorMessage
		});
	}
}

exports.updateStorageFileById = async (req, res) => {
	try {
		const storageFiles = await StorageFile.findByIdAndUpdate({ _id: req.params.id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
		return res.status(status.success).json({
			message: 'Storage Files has been updated successfully.',
			data: storageFiles,
		});
	} catch (err) {
		return res.status(status.serverError).json({
			message: messages.serverErrorMessage
		});
	}
}