const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    heading: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    image_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    type: {
        type: String,
        enum: ['home']
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

aboutSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.abouts, aboutSchema);