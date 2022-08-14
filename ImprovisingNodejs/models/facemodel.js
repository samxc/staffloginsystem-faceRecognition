const mongoose = require('mongoose');

const faceSchema = mongoose.Schema({
    label:{
        type: String,
        required: true,
        unique: true
    },
    descriptions:{
        type: Array,
        required: true
    }
});

const FaceModel = mongoose.model('FaceModel', faceSchema);

module.exports = FaceModel;
