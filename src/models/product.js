const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null
    },
    image_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
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

productSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.products, productSchema);