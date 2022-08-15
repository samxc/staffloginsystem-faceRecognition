document.querySelector('form').addEventListener('submit',(e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    LoginUsers(email, password);               
})

const LoginUsers = async (email, password) =>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/users/login',
            data:{
                email,
                password
            }
        });
        if(result.data.status === 'success'){
            window.setTimeout(()=>{
                location.assign('/homepage');
            }, 1000);
        }
    }catch(err){
        alert(err.response.data.message);
    } 
}