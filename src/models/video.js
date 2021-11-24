const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    video_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    upload_date: {
        type: Date,
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