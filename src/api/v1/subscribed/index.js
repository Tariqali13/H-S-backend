const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const subscribeValidations = require('./subscribe.validation');
const subscribeController = require('./subscribe.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');


router.get(
    '/all-subscriptions',
    [jwtValidations, subscribeValidations.validateGetAllSubscribtions],
    subscribeController.getAllSubscribtions
);

router.get(
    '/:id',
    [jwtValidations, subscribeValidations.validateGetSubscribtionById],
    subscribeController.getSubscribtionById
);

router.post(
    '/',
    [jwtValidations, subscribeValidations.validateCreateSubscribtion],
    subscribeController.createSubscribtion
);

router.post(
    '/send-emails',
    [jwtValidations, subscribeValidations.validateSendEmails],
    subscribeController.sendEmails
);

router.delete(
    '/:id',
    [jwtValidations, subscribeValidations.validateDeleteSubscribtionById],
    subscribeController.deleteSubscribtionById
);


module.exports = router;
