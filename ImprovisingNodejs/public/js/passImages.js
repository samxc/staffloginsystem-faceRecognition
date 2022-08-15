document.querySelector('form').addEventListener('submit',(e) => {
    e.preventDefault();
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value; 
    const Files = document.getElementById('file-upload').files;
    const label = fname + ' ' + lname;
    console.log(Files);
    postImage(Files, label);               
})

const postImage = async (Files, label) => {
    try{
        const formData = new FormData();
        for(i=0; i<Files.length; i++){
        formData.append('Files', Files[i]);
        }
        formData.append('label', label);
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/faces/post-face',
            headers: {
                "Content-Type": "multipart/form-data"
              },
            data: formData
        });
        console.log(result.data);
    }catch(err){
        console.log(err);
    }

}