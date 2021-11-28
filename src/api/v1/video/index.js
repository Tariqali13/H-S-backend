const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const videoValidations = require('./video.validation');
const videoController = require('./video.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const videoMiddleware = require(appRoot + '/src/middle-wares/validation/video');


router.get(
    '/all-videos',
    [jwtValidations, videoValidations.validateGetAllVideo],
    videoController.getAllVideo
);

router.get(
    '/videos-count',
    [jwtValidations],
    videoController.getVideoCount
);

router.get(
    '/:id',
    [jwtValidations, videoValidations.validateGetVideoById, videoMiddleware.validateVideo],
    videoController.getVideoById
);

router.post(
    '/',
    [jwtValidations, videoValidations.validateCreateVideo],
    videoController.createVideo
);

router.post(
    '/multiple',
    [jwtValidations, videoValidations.validateCreateVideoMultiple],
    videoController.createVideoMultiple
);

router.patch(
    '/:id',
    [jwtValidations, videoMiddleware.validateVideo, videoValidations.validateUpdateVideo],
    videoController.updateVideoById
);

router.delete(
    '/:id',
    [jwtValidations, videoMiddleware.validateVideo, videoValidations.validateDeleteVideoById],
    videoController.deleteVideoById
);


module.exports = router;
