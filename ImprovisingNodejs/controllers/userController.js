const User = require('../models/userModel');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createUsers = (req, res) => {
    res.status(500).json({
        status: '500 Internal Server Error',
        message: 'This route is not defined! Please use /signup instead'
    });
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
exports.getAllUsers = factory.getAll(User);
exports.getUsers = factory.getOne(User);
exports.updateUsers = factory.updateOne(User);
exports.deleteUsers = factory.deleteOne(User);

