const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const storageFileController = require('./storage-file.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const storageFileValidation = require('./storage-file.validation');

// --Api Route-- /api/v1/storage-file

router.get(
	'/:id',
	[jwtValidations],
	storageFileController.getStorageFileById
);
// In this method we will get all permission
router.post('/',
	[jwtValidations, storageFileValidation.validateAddStorageFileData],
	storageFileController.createStorageFile
);

router.post('/multiple-files',
	[jwtValidations, storageFileValidation.validateAddMultiStorageFileData],
	storageFileController.createStorageFileMultiple
);


router.patch(
	'/:id',
	[jwtValidations],
	storageFileController.updateStorageFileById
);

module.exports = router;
