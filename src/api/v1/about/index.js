const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const aboutValidations = require('./about.validation');
const aboutController = require('./about.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');

router.get(
    '/',
    [jwtValidations, aboutValidations.validateGetAbout],
    aboutController.getAbout
);

router.patch(
    '/:id',
    [jwtValidations, aboutValidations.validateUpdateAbout],
    aboutController.updateAboutById
);

module.exports = router;
