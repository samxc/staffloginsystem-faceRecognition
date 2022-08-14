const faceapi = require('face-api.js');
const canvas = require('canvas');
const FaceModel = require('../models/facemodel');

exports.LoadModels = async ()=>{
    await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + '/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + '/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + '/models');
}

const uploadLabeledImages = async (images, label)=>{
    try{
        const descriptions = [];
        for(let i=0; i<images.length; i++){
            const img = await canvas.loadImage(images[i]);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
        }

        const createFace = new FaceModel({
            label: label,
            descriptions: descriptions
        });
        await createFace.save();
        return true;
    }catch(err){
        console.log(err);
        return(err);
    };
}

exports.postFace = async (req, res) => {
    try{
        const FilesArray = [];
        const AllImageFiles = await req.files.Files;
        for(i=0; i<AllImageFiles.length; i++) {
            const eachFile = req.files.Files[i].tempFilePath;
            FilesArray.push(eachFile);
        }
        const label = await req.body.label;
        let result = await uploadLabeledImages(FilesArray, label);
        if(result){
            res.json({message: 'Face data stored sucessfully'});
        }else{
            res.json({message: 'Somthing went wrong, please try again'});
        }
    }catch(err){
        console.log(err);
    }
}

exports.checkFace = async (req, res) => {
    try{
        const face = await FaceModel.find();
        const result = face.length;
        res.status(200).json({
            success:'success',
            result: result,
            data: face
        })
    }catch(err){
        console.log(err);
    }

}



