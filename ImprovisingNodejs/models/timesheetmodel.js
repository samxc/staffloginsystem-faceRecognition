const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    day:{
        type: 'string',
        require: [true, 'A timesheet should have a day'],
        trim: true
    },
    task:{
        type:String,
        trim: true,
        required: [true, 'A task must be assign on a timesheet']
    },
    duration:{
        type:Number,
        require: [true, 'A hour duration should be provided to a timesheet']
    },
    Startdate: Date.UTC(),
    Enddate: Date.UTC(),
    name: {
        type: String, 
        ref:'User',
        required: [true, 'Timesheet must belong to a user']
    },                                   
    createdAt:{
        type: Date,
        default: Date.now
    }
},
{
   toJson:{ virtuals: true},

    toObject:{ virtuals: true}
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;

