const FaceModel = require('../models/facemodel');

exports.createOne = async (req, res)=>{
    try{
        const createFace = new FaceModel(req.body);
        await createFace.save();
    }catch(err){
        console.log(err);
        return(err);
    };
}
