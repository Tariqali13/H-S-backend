const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    first_name: {
        type: String,
        default: null,
    },
    last_name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null,
    },
    phone_number: {
        type: String,
        default: null,
    },
});

consultationSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.consultations, consultationSchema);