const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    // 1) create a transporter instance
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define the email options
    const mailOptions = {
        from: 'Sam Sapkota <resetPasswordEmail@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html: 
    }
    // 3) send the email with node mailer
    await transporter.sendMail(mailOptions)
};


module.exports = sendEmail;