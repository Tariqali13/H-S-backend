const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    video_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    image_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    folder_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.folders,
    },
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
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

videoSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.videos, videoSchema);