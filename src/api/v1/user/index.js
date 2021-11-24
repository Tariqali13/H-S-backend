const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const userValidations = require('./user.validation');
const userController = require('./user.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const UserMiddleware = require(appRoot + '/src/middle-wares/validation/user');

router.get(
    '/:id',
    [jwtValidations, UserMiddleware.validateUser, userValidations.validateGetUserById],
    userController.getUserById
);

router.patch(
    '/:id',
    [jwtValidations,  UserMiddleware.validateUser, userValidations.validateUpdateUser],
    userController.updateUserByUserId
);


module.exports = router;
