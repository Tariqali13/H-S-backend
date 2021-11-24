const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    full_name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        unique: false,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    phone_number: {
        type: String,
        default: null
    },
    event_date: {
        type: Date,
        default: null
    },
    // pricing_plan: {
    //     type: Schema.Types.ObjectId,
    //     ref: schemaReferences.pricing_plans,
    // },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.users,
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.users,
    }
});

bookingSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.bookings, bookingSchema);