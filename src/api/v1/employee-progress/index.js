const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const employeeProgressValidations = require('./employee-progress.validation');
const employeeProgressController = require('./employee-progress.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');

router.get(
    '/',
    [jwtValidations, employeeProgressValidations.validateGetEmployeeProgress],
    employeeProgressController.getEmployeeProgress
);

router.post(
    '/create-progress',
    [jwtValidations, employeeProgressValidations.validateCreateProgress],
    employeeProgressController.createProgress
);

module.exports = router;
