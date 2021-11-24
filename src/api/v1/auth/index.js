const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const authValidations = require('./auth.validation');
const authController = require('./auth.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');

router.post('/login', authValidations.validateLogin, authController.login);

router.get('/logout', jwtValidations, authController.logoutUser);

router.patch("/update-password", jwtValidations, authValidations.validateUpdatePassword, authController.updatePassword);



module.exports = router;
