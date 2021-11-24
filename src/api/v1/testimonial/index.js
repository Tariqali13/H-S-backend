const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const testimonialValidations = require('./testimonial.validation');
const testimonialController = require('./testimonial.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const TestimonialMiddleware = require(appRoot + '/src/middle-wares/validation/testimonial');


router.get(
    '/all-Testimonials',
    [jwtValidations, testimonialValidations.validateGetAllTestimonials],
    testimonialController.getAllTestimonials
);

router.get(
    '/:id',
    [jwtValidations, testimonialValidations.validateGetTestimonialById, TestimonialMiddleware.validateTestimonial],
    testimonialController.getTestimonialById
);

router.post(
    '/',
    [jwtValidations, testimonialValidations.validateCreateTestimonial],
    testimonialController.createTestimonial
);

router.patch(
    '/:id',
    [jwtValidations, TestimonialMiddleware.validateTestimonial, testimonialValidations.validateUpdateTestimonial],
    testimonialController.updateTestimonialById
);

router.delete(
    '/:id',
    [jwtValidations, TestimonialMiddleware.validateTestimonial, testimonialValidations.validateDeleteTestimonialById],
    testimonialController.deleteTestimonialById
);


module.exports = router;
