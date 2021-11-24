const mongoose = require('mongoose');
const schemaReferences = require('./schema-references');
const Schema = mongoose.Schema;

const storageFileSchema = new Schema({
  file_name: {
    type: String,
    required: true,
    message: 'Name of storage file'
  },
  file_type: {
    type: String,
    message: 'File type i.e. Image, Video, PDF, Word etc'
  },
  file_url: {
    type: String,
    required: true,
    message: 'URL of the file saved at either wistia or AWS'
  },
  is_deleted:{
    type: Boolean,
    default: false
  },
  schedule_to_delete: {
    type: String,
    required: true,
    default: false,
    message:
      'Flag for scheduler to pick files and delete. Default value should be false'
  },
  original_name: {
    type: String
  },
  file_size: {
    type: String
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: schemaReferences.users,
    message: 'User Id of user who created this file'
  }
});

storageFileSchema.set('timestamps', true);

module.exports = mongoose.model(schemaReferences.storageFiles, storageFileSchema);
