Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(start)

function start() {
    const video = document.getElementById('video');
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    console.log('video added')
    recognizeFaces()
}

async function recognizeFaces() {

    const LabelArray = [];
    const res = await axios.get('http://localhost:8080/faces/check-face');
    const schedule = await axios.get(`http://localhost:8080/timesheet/viewsheets/allsheets`);
    const faces = res.data.data;
    const objs = schedule.data.data.data;

    for(i=0; i<faces.length; i++) {
        for(j=0; j<faces[i].descriptions.length; j++) {
            faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
        }
        faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);
    }

    const faceMatcher = await new faceapi.FaceMatcher(faces, 0.6);
    const video = document.getElementById('video');
    const users = document.getElementById('users');

    video.addEventListener('play', async () => {

        const canvas = faceapi.createCanvasFromMedia(video);
        
        const div = document.getElementById('vframe');
       
        div.append(canvas);

        const displaySize = { width: video.width, height: video.height }
        
        faceapi.matchDimensions(canvas, displaySize)

        setInterval(async () => {

            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            faceapi.draw.drawDetections(canvas, resizedDetections);

            const dates = new Date();

            const newdate = dates.toLocaleDateString('en-US', {hour:'numeric', minute:'numeric', second:'numeric', hours12:true});

            const results = resizedDetections.map((d) => {

                const faceMatched = faceMatcher.findBestMatch(d.descriptor);

                while(faceMatched){
                    if(!LabelArray.includes(faceMatched.label) && faceMatched.label != "unknown"){
                        LabelArray.push(faceMatched.label);
                    }
                    for(i=0; i<LabelArray.length; i++){
                        for(j=0; j<objs.length; j++){

                            JSON.stringify(objs);
                        
                            let date = new Date(objs[j].Startdate);
                            
                            let startTime = date.toLocaleDateString('en-US', {hour:'numeric', minute:'numeric', second:'numeric', hours12:true});
                    
                            let date2 = new Date(objs[j].Enddate);
                    
                            let endTime = date2.toLocaleDateString('en-US', {hour:'numeric', minute:'numeric', second:'numeric', hours12:true});
    
                    
                            if(!users.innerHTML.match(objs[j].name) && faceMatched.label === objs[j].name && faceMatched.label != "unknown"){

                                console.log(users.innerHTML.length)

                                if(newdate === startTime && !users.innerHTML.match(faceMatched.label) && faceMatched.label === objs[j].name && faceMatched.label != "unknown"){
                        
                                    console.log(startTime);
                                    let li = document.createElement('li');
                                    li.setAttribute("id",`${objs[j].name}`)
                                    li.style.backgroundColor = "green";
                                    li.style.color = "white";
                                    li.innerText = `${objs[j].name} logged In`;
                                    users.appendChild(li);

                                }else if(newdate > startTime && newdate < endTime && !users.innerHTML.match(faceMatched.label) && faceMatched.label === objs[j].name && faceMatched.label != "unknown"){
                        
                                    console.log(startTime);
                                    let li = document.createElement('li');
                                    li.setAttribute("id",`${objs[j].name}`)
                                    li.style.backgroundColor = "red";
                                    li.style.color = "white";
                                    li.innerText = `${objs[j].name} logged late`;
                                    users.appendChild(li);
                                }else{
                                    console.log('scanning ...')
                                }

                            }else if(newdate === endTime && users.innerHTML.match(objs[j].name) && faceMatched.label != "unknown"){
                                try{
                                    console.log(endTime);                                
                                    const remove = document.getElementById(`${objs[j].name}`);
                                    remove.backgroundColor = "red";
                                    remove.color = "white";
                                    remove.innerText = `${objs[j].name} logged out`;
                                }catch(e) {
                                    console.log('The list is empty!')
                                }
                            }else{
                                console.log('no logged out users..')
                            }
                        }
                    }
                    break;
                }
                return faceMatched;
            })
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box; 
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
                drawBox.draw(canvas)   
            })
        }, 100);
    })
}


