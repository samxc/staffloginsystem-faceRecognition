document.querySelector('form').addEventListener('submit',(e) => {
    e.preventDefault();
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('Confirmpassword').value; 
    const role = document.querySelector('input[type="radio"]:checked').value;
    const name = fname + ' ' + lname;
    postUsers(name, email, password, passwordConfirm, role);               
})

const postUsers = async (name, email, password, passwordConfirm, role) =>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8080/users/signup',
            data:{
                name,
                email,
                password,
                passwordConfirm,
                role
            }
        });
        console.log(result.data)
    }catch(err){
        console.log(err);
    }

}