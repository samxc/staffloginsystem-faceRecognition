const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next)=>{
    const doc = await Model.findAllAndDelete(req.params.name);
    
    if(!doc){
        return next(new AppError('No model found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.name, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: doc
    });
})

exports.createOne = Model => catchAsync(async (req, res, next)=>{
    const doc = await Model.create(req.body);
    
    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: doc
    });
})

exports.getOne = (Model) => catchAsync(async (req, res, next)=>{
    let query = Model.findOne(req.params.name);
    const doc = await query;

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data:{
            data:doc
        }
    });
})

exports.getTimesheet = Model =>catchAsync(async (req, res, next) => {
    const doc = await Model.aggregate([
        { 
            $match:{
                name:{$eq: req.query.name}
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
            data: doc
        }
    });
});

exports.getAllTimesheet = Model =>catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
        status: 'success',
        message: 'All timesheet was successfully loaded!',
        results: doc.length,
        data:{
            data: doc
        }
    })
})

exports.getAll = Model =>catchAsync(async (req, res, next) => {

    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId};

    //To allow for nested GET reviews on tour (little hack)
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
            data: doc
        }
    });
});
