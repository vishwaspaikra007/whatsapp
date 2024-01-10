const express = require('express')
const router = express.Router()
const emailsOTPModel = require('../database/models/emailsOTPModel')

router.post('/verifyOTP', (req,res) => {
    const otpFromMail = req.body.otp
    const email = req.body.email
    emailsOTPModel.findOne({email: email, otp: otpFromMail}).then(result => {
        console.log("result" , result)
        if(!result)
            res.send({verified: false, msg:"otp not valid"})
        else
            res.send({verified: true, msg:"email verified"})
    }).catch(err => {
        console.log("err", err)
    })

})
module.exports = router