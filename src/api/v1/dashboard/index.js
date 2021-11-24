const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const dashboardValidation = require('./dashboard.validation');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');

router.get(
    '/admin-stats',
    [jwtValidations, dashboardValidation.validateGetDashboardStats],
    dashboardController.getAdminDashboardStats
);

module.exports = router;