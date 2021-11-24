const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    full_name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    subject: {
        type: String,
        default: null,
    },
    phone_number: {
        type: String,
        default: null,
    },
    message: {
        type: String,
        default: null,
    }
});

contactSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.contacts, contactSchema);