const appRoot = require('app-root-path');
const Testimonial = require(appRoot + '/src/models/testimonial');
const StorageFile = require(appRoot + '/src/models/storage-file');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;
const TestimonialUtil = require('./util');

exports.getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id).populate('testimonial_by_image_id').populate('created_by');
        return res.status(status.success).json({
            message: 'testimonial found Successfully.',
            data: testimonial,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllTestimonials = async (req, res) => {
    try {
        const { records_per_page = 0, page_no = 1} = req.query;
        const query = await TestimonialUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const testimonials = await Testimonial.find(query).populate('created_by').populate("testimonial_by_image_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfTestimonials = await Testimonial.countDocuments(query)
        const isTopReview = await Testimonial.countDocuments({ is_top_review: true });
        return res.status(status.success).json({
            message: 'Testimonials found Successfully.',
            data: testimonials,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_testimonials: totalNumberOfTestimonials,
            is_top_review_testimonial: isTopReview,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.create({ ...req.body, is_top_review: false });
        return res.status(status.success).json({
            message: 'testimonial Created Successfully.',
            data: testimonial,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'testimonial Updated Successfully.',
            data: testimonial,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);
        await StorageFile.findByIdAndUpdate({ _id: testimonial.testimonial_by_image_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        await Testimonial.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'testimonial deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}