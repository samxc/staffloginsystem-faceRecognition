const express = require('express');
const timesheetController = require('../controllers/timesheetController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'))

router
.route('/postsheets')
.post(timesheetController.createTimesheet);

router
.route('/viewsheets')
.get(timesheetController.viewsheets);

router
.route('/viewsheets/allsheets')
.get(timesheetController.viewallsheets);
module.exports = router;