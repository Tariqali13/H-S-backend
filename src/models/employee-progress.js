const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const employeeProgressSchema = new Schema({
    video_ids: [{
        type: Schema.Types.ObjectId,
        ref: schemaReferences.storageFiles,
    }],
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: schemaReferences.users,
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

employeeProgressSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.employee_progress, employeeProgressSchema);