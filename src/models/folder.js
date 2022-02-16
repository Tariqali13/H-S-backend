const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    image_id: {
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
    total_videos: {
        type: Number,
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

folderSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.folders, folderSchema);