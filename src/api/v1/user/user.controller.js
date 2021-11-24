const appRoot = require('app-root-path');
const User = require(appRoot + '/src/models/user');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

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

