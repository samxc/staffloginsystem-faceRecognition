const Timesheet = require('../models/timesheetmodel');
const factory = require('./handlerFactory');

exports.createTimesheet = factory.createOne(Timesheet);
exports.updateTimesheet = factory.updateOne(Timesheet);
exports.deletTimesheet = factory.deleteOne(Timesheet);
exports.viewsheets = factory.getTimesheet(Timesheet);
exports.viewallsheets = factory.getAllTimesheet(Timesheet);


