document.querySelector('form').addEventListener('submit',(e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const select = document.getElementById('Days-name');
    const daysValue = select.options[select.selectedIndex].value;
    const startdate = document.getElementById('StartDate').value;
    const enddate = document.getElementById('EndDate').value;
    const selecTask = document.getElementById('Task-name');
    const taskValue = selecTask.options[selecTask.selectedIndex].value; 
    postUsers(daysValue, startdate, enddate, taskValue, fullname);               
})

const postUsers = async (day, Startdate, Enddate, task, name) =>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/timesheet/postsheets',
            data:{
                day,
                Startdate,
                Enddate,
                task,
                name
            }
        });
        if(result.data.status === 'success'){
            alert('Timesheet successfully created!');
            window.setTimeout(()=>{
                location.assign('/Roster');
            }, 1000);
        }
    }catch(err){
        alert(err.response.data.message);
    }

}