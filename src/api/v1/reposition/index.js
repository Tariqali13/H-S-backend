const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const auth = require(appRoot + '/src/middle-wares/auth');
const repositionController = require('./reposition.controller');
const repositionValidator = require('./reposition.validation');

router.post('/',
    [auth, repositionValidator.validateReposition],
    repositionController.repositionData
);

module.exports = router;
