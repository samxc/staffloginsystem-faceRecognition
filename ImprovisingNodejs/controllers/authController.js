const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id =>jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

const createSendToken = (user, statusCode, res, req)=>{
        
    const token = signToken(user._id);

    const cookieOptions = {
        expiresIn: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 60 * 1000
            ),
        httpOnly: true, 
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token,{
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 60 * 1000),
        httpOnly: true,
    });

    // to remove the password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    })

}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next)=>{
    const {email, password} = req.body;

    //1) check if the email and pass exists
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    }
    //2) check if the user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);
    // eslint-disable-next-line no-console
    console.log(correct);
    
    if(!user || !correct) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //3) If everything is ok, send token to client
    createSendToken(user, 200, res);

});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];       
    }else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    // 2) validate the signToken
    if(!token) {
        return next(new AppError('You are not logged in , Please login to get access!!', 401));
    }
    // 3) Check if user still exists
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);

    if(!freshUser) {
        return next(new AppError('The user belonging to the given token no longer exist.', 401));
    }
    // 4) Check if user changed passwords after the JWT token was issued
    if(freshUser.changesPasswordAfter(decoded.iat)){
        return next(new AppError('The User recently changed password! please login again', 401));
    };
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles)=>(req, res, next) => {
    // roles is an array ['admin', 'lead-guide']. role='user'
    if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to access this action', 403));
    }
    next();
};

exports.forgotPassword =catchAsync(async (req, res, next)=>{
    // 1) Get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError('There is no user with this email address', 404));
    }
    // 2) Generate the random reset signToken
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email

    const resetURL = `${req.protocol}://${req.get(
        'host'
        )}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a new password setup here, ${resetURL}.\n if it not you please ignore this email.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'your password reset token is valid for 10 minutes',
            message 
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next)=>{
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});


exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) check if posted current password is correctPassword
    if(!user.correctPassword(req.body.passwordCurrent, user.password)){
        return next(new AppError('Your current password is incorrect', 401));
    }
    // 3) if so, update password with
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4) login user in , send jwt
    createSendToken(user, 200, res);

});
