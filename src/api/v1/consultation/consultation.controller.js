const appRoot = require('app-root-path');
const Consultation = require(appRoot + '/src/models/consultation');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

exports.getConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await Consultation.findById(id);
        return res.status(status.success).json({
            message: 'Consultation found Successfully.',
            data: consultation,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllConsultations = async (req, res) => {
    try {
        const { records_per_page, page_no } = req.query;
        const query = req.query;
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const consultations = await Consultation.find(query).limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfConsultations = await Consultation.countDocuments(query)
        return res.status(status.success).json({
            message: 'Consultations found Successfully.',
            data: consultations,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_consultations: totalNumberOfConsultations,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.create(req.body);
        return res.status(status.success).json({
            message: 'Consultation Created Successfully.',
            data: consultation,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await Consultation.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Consultation Updated Successfully.',
            data: consultation,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        await Consultation.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Consultation deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}