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
        ref: schemaReferences.videos,
    },
    order_by: {
        type: Number,
        default: 0,
    },
    parent_count: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    total_videos: {
        type: Number,
    },
    total_folders: {
        type: Number,
    },
    is_blocked: {
        type: Boolean,
        default: false,
    },
    unblock_after: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.videos,
    },
    type: {
        enum: ['folder', 'video'],
        type: String,
        default: 'video',
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