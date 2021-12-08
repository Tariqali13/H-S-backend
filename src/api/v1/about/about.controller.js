const appRoot = require('app-root-path');
const About = require(appRoot + '/src/models/about');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;


exports.getAbout = async (req, res) => {
    try {
        const about = await About.findOne({}).populate("image_id");
        return res.status(status.success).json({
            message: 'Abouts found Successfully.',
            data: about,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateAboutById = async (req, res) => {
    try {
        const { id } = req.params;
        const findAbout = await About.findById(id);
        if (!findAbout) {
            return res.status(status.notFound).json({
                message: 'About data not found.',
            });
        }
        const about = await About.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'About Updated Successfully.',
            data: about,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}