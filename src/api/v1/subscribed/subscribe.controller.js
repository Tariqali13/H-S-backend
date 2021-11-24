const appRoot = require('app-root-path');
const Subscribtion = require(appRoot + '/src/models/subscribtion');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;
const subscribeUtil = require('./util');
const emailUtility = require(appRoot + "/src/utils/email-util");
const User = require(appRoot + '/src/models/user');
const sendEmail = emailUtility.email();
const _get = require('lodash.get');

exports.getSubscribtionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscribtion = await Subscribtion.findById(id);
        return res.status(status.success).json({
            message: 'Subscribtion found Successfully.',
            data: subscribtion,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllSubscribtions = async (req, res) => {
    try {
        const { records_per_page, page_no } = req.query;
        const query = await subscribeUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const subscribtions = await Subscribtion.find(query).limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfSubscribtions = await Subscribtion.countDocuments(query)
        return res.status(status.success).json({
            message: 'Subscribtions found Successfully.',
            data: subscribtions,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_subscribtions: totalNumberOfSubscribtions,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createSubscribtion = async (req, res) => {
    try {
        const subscribtion = await Subscribtion.create(req.body);
        return res.status(status.success).json({
            message: 'Subscribtion Created Successfully.',
            data: subscribtion,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.sendEmails = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const user_id = _get(req, 'user_data.user_id')
        console.log("user_id", user_id)
        const user = await User.findById({ _id: user_id });
        const subscribtions = await Subscribtion.find({});
        console.log("subscribtions", subscribtions)
        if (subscribtions.length > 0) {
            for (const subscribe of subscribtions) {
                let emailParams = {
                    email_from_name: `${_get(user, 'first_name', '')} ${_get(user, 'last_name')}`,
                    email_from: "alisaschenkphoto@gmail.com",
                    email_to: _get(subscribe, 'email', ''),
                    subject: subject,
                    email_content: message,
                }
                const emailSend = await sendEmail.send(emailParams);
                if (!emailSend) {
                    return res.status(status.badRequest).json({
                        message: 'Email can not be send.',
                    });
                }
            }
        } else {
            return res.status(status.badRequest).json({
                message: 'No email To Send.',
            });
        }
        return res.status(status.success).json({
            message: 'Emails sent successfully.',
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteSubscribtionById = async (req, res) => {
    try {
        const { id } = req.params;
        await Subscribtion.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Subscribtion deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}