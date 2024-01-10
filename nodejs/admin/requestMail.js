var nodemailer = require('nodemailer');
const express = require('express')
const router = express.Router()
const emailsOTPModel = require('../database/models/emailsOTPModel')
const userPasswordModel = require('../database/models/userPasswordModel')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'whatsapplookalike007@gmail.com',
        pass: process.env.GOOGLE_AUTH_PASSWORD_FOR_APPS
    }
});


router.post('/requestMail', (req, res) => {
    userPasswordModel.findOne({email: req.body.to})
        .then(user => {
            if(user)
                res.send({registered: true, msg:"The user is already registered"})
            else {
                const emailOTP = new emailsOTPModel()

                const OTP = parseInt(Math.random() * 1000000)
                const otpText = `${OTP} is your OTP for whatsApp look alike Email verification. valid for 2 minute sent to you at ${new Date()}`
            
                let mailOptions = {
                    from: 'whatsapplookalike007@gmail.com',
                    to: req.body.to,
                    subject: req.body.subject || OTP + " OTP from whatsapp look alike",
                    text: req.body.text || otpText,
                };
            
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.send({OTPsent: false, msg: error})
                    } else {
                        console.log('Email sent: ' + info.response);
                        emailsOTPModel.deleteOne({ email: req.body.to }).then(doc => {
                            console.log(doc)
                            emailOTP.email = req.body.to
                            emailOTP.otp = OTP
                            emailOTP.save().then(user => {
                                res.send({OTPsent: true, msg: "email sent"})
                            }).catch(err => {
                                res.send({OTPsent: false, msg: err})
                            })
                            
                        }).catch(err => {
                            res.send(err)
                        })
            
                    }
                });
            
            }
        }).catch(err => {
            res.send({error: true, msg: err})
        })
})

module.exports = router