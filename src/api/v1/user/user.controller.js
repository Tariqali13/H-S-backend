const appRoot = require('app-root-path');
const User = require(appRoot + '/src/models/user');
const StorageFile = require(appRoot + '/src/models/storage-file');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const Video = require(appRoot + '/src/models/video');
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
        const totalVideos = await Video.countDocuments({ is_deleted: false });
        const users = await User.find(query).populate('created_by').populate("image_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        for (const user of users) {
            const employeeProgress = await EmployeeProgress.findOne({ employee_id: user._id });
            user.employee_progress = (_get(employeeProgress, 'video_ids', []).length / totalVideos) * 100;
        }
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
        if (!user.is_active) {
            return res.status(status.unauthorized).json({
                message: 'Your account is blocked. Please contact Admin'
            });
        }
        const totalVideos = await Video.countDocuments({});
        const employeeProgress = await EmployeeProgress.findOne({ employee_id: user._id });
        user.employee_progress = (_get(employeeProgress, 'video_ids', []).length / totalVideos) * 100;
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
        const { new_password } = req.body;
        if (new_password) {
            req.body.password = await auth.generateHash(new_password);
        }
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
        if (user?.image_id) {
            await StorageFile.findByIdAndUpdate({ _id: user.image_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        }
        await EmployeeProgress.deleteOne({ employee_id: user._id })
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