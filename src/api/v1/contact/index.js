const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const contactValidations = require('./contact.validation');
const contactController = require('./contact.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const ContactMiddleware = require(appRoot + '/src/middle-wares/validation/contact');


router.get(
    '/all-contacts',
    [jwtValidations, contactValidations.validateGetAllContacts],
    contactController.getAllContacts
);

router.get(
    '/:id',
    [jwtValidations, contactValidations.validateGetContactById, ContactMiddleware.validateContact],
    contactController.getContactById
);

router.post(
    '/',
    [jwtValidations, contactValidations.validateCreateContact],
    contactController.createContact
);

router.delete(
    '/:id',
    [jwtValidations, ContactMiddleware.validateContact, contactValidations.validateDeleteContactById],
    contactController.deleteContactById
);


module.exports = router;
