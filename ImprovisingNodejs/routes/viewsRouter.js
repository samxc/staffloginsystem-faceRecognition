const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', (req,res,next)=>{
    res.status(200).json({
        message:'Hello, Please go to /registration or /login route to continue'
    })
})
router.get('/registration', viewsController.RegistrationForm);

router.get('/login', viewsController.LoginForm);

router.get('/Roster', viewsController.TimeSheet);

router.get('/homepage', viewsController.HomePage);

router.get('/activeusers', viewsController.ActiveUsers);

router.get('/viewsheets', viewsController.viewsheets);


module.exports = router;

