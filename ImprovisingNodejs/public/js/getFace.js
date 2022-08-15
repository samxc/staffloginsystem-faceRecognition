const getDescriptorsFromDB = async (image) => {
    let faces = await FaceModel.find();
    for(let i=0; i<faces.length; i++) {
        for(let j=0; j<faces[i].descriptions.length; j++) {
            faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
        }
        faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);  
    }

    const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);
    const img = await canvas.loadImage(image);
    let temp = faceapi.createCanvasFromMedia(img);
    const displaySize = {width: img.width, height: img.height};
    faceapi.matchDimensions(temp, displaySize);

    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d)=> faceMatcher.findBestMatch(d.descriptor));
    return results;
}