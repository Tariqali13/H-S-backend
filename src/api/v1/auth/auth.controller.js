const appRoot = require('app-root-path');
const User = require(appRoot + '/src/models/user');
const authUtil = require(appRoot + '/src/utils/auth-util');
const bcrypt = require('bcryptjs');
const _get = require('lodash.get');
const auth = authUtil.auth();
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: new RegExp("^" + email + "$", "i")});
        if (!user) {
            return res.status(status.notFound).json({
                message: 'No User Found'
            });
        }
        const matchPassword = await bcrypt.compare(password, _get(user, 'password'));
        if (!matchPassword) {
            return res.status(status.unauthorized).json({
                message: 'Invalid Email and Password'
            });
        }
        const tokenPayload = {
            user_name: _get(user, 'first_name') + " " + _get(user, 'last_name'),
            user_id: _get(user, '_id'),
            email: _get(user, 'email'),
        };
        const token = await auth.generateToken(tokenPayload);
        return res.status(status.success).json({
            message: 'Login Successfully.',
            data: user,
            token: token,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports. logoutUser = async (req, res) => {
    try {
        req.user_data = null;
        req.session.destroy();
        req.logOut();
        return res.status(status.success).json({
            message: 'Logout.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        console.log(req.user_data)
        const user_id = _get(req, 'user_data.user_id')
        const { old_password, password } = req.body;
        const userToFind = await User.findById(user_id);
        if (!userToFind) {
            return res.status(status.notFound).json({
                message: 'No User Found'
            });
        }
        if (userToFind.password) {
            const matchPassword = await bcrypt.compare(old_password, userToFind.password);
            if (!matchPassword) {
                return res.status(401).json({
                    message: 'Please check your current password and try again.'
                });
            }
            const matchPasswordSame = await bcrypt.compare(password, userToFind.password);
            if (matchPasswordSame) {
                return res.status(409).json({
                    message: 'Please use new password different from old password.'
                });
            }
        }
        const hashPassword = await auth.generateHash(password);
        const userUpdated = await User.findByIdAndUpdate({_id: user_id}, {password: hashPassword}, {new: true});
        return res.status(status.success).json({
            message: 'Password updated successfully.',
            data: userUpdated,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}



