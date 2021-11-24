const appRoot = require('app-root-path');
const Contact = require(appRoot + '/src/models/contact');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        return res.status(status.success).json({
            message: 'Contact found Successfully.',
            data: contact,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const { records_per_page, page_no } = req.query;
        const query = req.query;
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const contacts = await Contact.find(query).limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfContacts = await Contact.countDocuments(query)
        return res.status(status.success).json({
            message: 'Contacts found Successfully.',
            data: contacts,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_contacts: totalNumberOfContacts,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        return res.status(status.success).json({
            message: 'Contact Created Successfully.',
            data: contact,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Contact Updated Successfully.',
            data: contact,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteContactById = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Contact deleted Successfully.',
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}