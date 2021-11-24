const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    email: {
        type: String,
        default: null,
    },
});

subscriptionSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.subscriptions, subscriptionSchema);