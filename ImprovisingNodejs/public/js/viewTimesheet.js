document.querySelector('form').addEventListener('submit',(e) => {
    e.preventDefault();
    const sheets = document.getElementById('data-sheets');
    sheets.value = '';
    const name = document.getElementById('username').value;
    postUsers(name);
});

const postUsers = async (name) =>{
    try{
        const result = await axios({
            method: 'GET',
            url: `http://localhost:8080/timesheet/viewsheets?name=${name}`,
        });

        const objs = result.data.data.data;
        const sheets = document.getElementById('data-sheets');
        for(i=0; i<objs.length; i++){
            if(!sheets.value.includes(objs[i].day && objs[i].Startdate && objs[i].Enddate)){
                JSON.stringify(objs);
                let date = new Date(objs[i].Startdate);
                let startTime = date.toLocaleDateString('en-US', {hour:'numeric', minute:'numeric', second:'numeric', hours12:true});
                let date2 = new Date(objs[i].Enddate);
                let endTime = date2.toLocaleDateString('en-US', {hour:'numeric', minute:'numeric', second:'numeric', hours12:true});
                sheets.value += `Day:\t${objs[i].day}\n\nStartTime:\t${startTime}\n\n EndTime:\t${endTime}\n\n Task:\t${objs[i].task}\n\n`;
            }
        }
    }catch(err){
        console.log(err);
    }
}