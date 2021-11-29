const appRoot = require('app-root-path');
const User = require(appRoot + '/src/models/user');
const StorageFile = require(appRoot + '/src/models/storage-file');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const UserUtil = require('./util');
const authUtil = require(appRoot + '/src/utils/auth-util');
const auth = authUtil.auth();
const { status, messages } = appConstants;


exports.getAllUsers = async (req, res) => {
    try {
        const { records_per_page = 0, page_no = 1} = req.query;
        const query = await UserUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const users = await User.find(query).populate('created_by').populate("image_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfUsers = await User.countDocuments(query)
        return res.status(status.success).json({
            message: 'Users found Successfully.',
            data: users,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_users: totalNumberOfUsers,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('image_id');
        return res.status(status.success).json({
            message: 'User found Successfully.',
            data: user,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { password } = req.body;
        req.body.password = await auth.generateHash(password);
        const user = await User.create(req.body);
        return res.status(status.success).json({
            message: 'User Created Successfully.',
            data: user,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateUserByUserId = async (req, res) => {
    try {
        const user_id = _get(req, 'params.id')
        const user = await User.findByIdAndUpdate({ _id: user_id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'User Updated Successfully.',
            data: user,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}


exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        await StorageFile.findByIdAndUpdate({ _id: user.image_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        await user.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'User deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}