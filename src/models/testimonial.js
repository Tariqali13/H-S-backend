const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    title: {
        type: String,
        default: null,
    },
    content: {
        type: String,
        default: null,
    },
    testimonial_by_image_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    testimonial_by_name: {
        type: String,
        default: null,
    },
    is_top_review: {
        type: Boolean,
        default: false,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.users,
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.users,
    }
});

testimonialSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.testimonials, testimonialSchema);