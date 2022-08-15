const fs = require('fs');
const path = require('path');
const directoryPath = path.join(`${__dirname}/../../ImagesFiles`)

exports.LoadFilesFrom = ()=>{
    const FileArray = [];
    fs.readdir(directoryPath,{withFileTypes: true}, (err, files)=>{
        if(err){
            console.log(err);
        }else{
            console.log("\n Current directory filenames: ");
            for(i=0; i<=files.length-1; i++){
                FileArray.push(files[i]);
            }
            for(i=0; i<FileArray.length; ++i){
                FaceFile.loadLabeledImages(FileArray[i].name);
            }
        }
    });
}