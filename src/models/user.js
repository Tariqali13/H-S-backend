const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    image_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    },
    first_name: {
        type: String,
        default: null,
    },
    last_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
        default: null
    },
    password: {
        type: String,
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
    position: {
        type: String,
        default: null
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
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

userSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.users, userSchema);