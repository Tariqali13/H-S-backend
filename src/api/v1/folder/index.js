const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const folderValidations = require('./folder.validation');
const folderController = require('./folder.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const folderMiddleware = require(appRoot + '/src/middle-wares/validation/folder');


router.get(
    '/all-folders',
    [jwtValidations, folderValidations.validateGetAllFolder],
    folderController.getAllFolder
);

router.get(
    '/:id',
    [jwtValidations, folderValidations.validateGetFolderById, folderMiddleware.validateFolder],
    folderController.getFolderById
);

router.post(
    '/',
    [jwtValidations, folderValidations.validateCreateFolder],
    folderController.createFolder
);

router.patch(
    '/:id',
    [jwtValidations, folderMiddleware.validateFolder, folderValidations.validateUpdateFolder],
    folderController.updateFolderById
);

router.delete(
    '/:id',
    [jwtValidations, folderMiddleware.validateFolder, folderValidations.validateDeleteFolderById],
    folderController.deleteFolderById
);


module.exports = router;
