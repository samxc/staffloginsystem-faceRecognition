const video = document.getElementById('capture-image');

if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia(
        {video:{}})
    .then((stream)=>{
        const video = document.getElementById('capture-image');
        const canvas = document.getElementById('canvas-capture');
        const button = document.getElementById('snap');
        const ctx = canvas.getContext('2d');
        video.srcObject=stream;
        button.addEventListener('click',()=>{
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            saveImage();
        })
        function saveImage() {
            var ua = window.navigator.userAgent;
            console.log(ua.indexOf("Chrome"));
        
            if (ua.indexOf("Chrome") > 0) {
                var link = document.createElement('a');
                link.download = "test.jpeg";
                link.href = canvas.toDataURL("image/jpeg", 1.0).replace("image/jpeg", "image/octet-stream");;
                link.click();
            }
            else {
                alert("Please use Chrome");
            }
        }
    }).catch((err)=>{
        console.log(err);
    })
}else{
    console.log('No');
}

