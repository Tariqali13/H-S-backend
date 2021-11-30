const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const consultationValidations = require('./consultation.validation');
const consultationController = require('./consultation.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const ConsultationMiddleware = require(appRoot + '/src/middle-wares/validation/consultation');


router.get(
    '/all-consultation',
    [jwtValidations, consultationValidations.validateGetAllConsultations],
    consultationController.getAllConsultations
);

router.get(
    '/:id',
    [jwtValidations, consultationValidations.validateGetConsultationById, ConsultationMiddleware.validateConsultation],
    consultationController.getConsultationById
);

router.post(
    '/',
    [jwtValidations, consultationValidations.validateCreateConsultation],
    consultationController.createConsultation
);

router.delete(
    '/:id',
    [jwtValidations, ConsultationMiddleware.validateConsultation, consultationValidations.validateDeleteConsultationById],
    consultationController.deleteConsultationById
);


module.exports = router;
