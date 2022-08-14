const TimeSheet = require('../models/timesheetmodel');
const catchAsync = require('../utils/catchAsync');


exports.RegistrationForm = (req, res) => {
  res.status(200).render('Registration', {
    title: 'Registration Form'
  })
}

exports.LoginForm = (req, res) => {
  res.status(200).render('Login', {
    title: 'Login Form'
  })
}

exports.TimeSheet = (req, res) => {
  res.status(200).render('TimeSheet', {
    title: 'Time Sheet'
  })
}


exports.HomePage = (req, res) => {
  res.status(200).render('HomPage', {
    title: 'Home Page'
  })
}

exports.ActiveUsers = (req, res) => {
  res.status(200).render('activepage', {
    title: 'active users'
  })
}

exports.viewsheets = catchAsync(async (req, res) => {
  res.status(200).render('viewsheet', {
    title: 'sheets view',
  })
});


