const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');
const storageFile = require('./storage-file');
const booking = require('./booking');
const contact = require('./contact');
const subscribed = require('./subscribed');
const testimonial = require('./testimonial');
const video = require('./video');
const employeeProgress = require('./employee-progress');
const dashboardStats = require('./dashboard');

router.use('/auth', auth);
router.use('/user', user);
router.use('/dashboard', dashboardStats);
router.use('/storage-file', storageFile);
router.use('/booking', booking);
router.use('/contact', contact);
router.use('/subscribed', subscribed);
router.use('/testimonial', testimonial);
router.use('/video', video);
router.use('/employee-progress', employeeProgress);

module.exports = router;
