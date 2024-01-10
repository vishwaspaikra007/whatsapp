const express = require('express')
const router = express.Router()
const userInfoMetaDataModel = require('../database/models/userInfoMetaDataModel')

router.post('/saveUserMetaData', (req, res, next) => customPassportAuthenticate(req, res, next), (req, res) => {

    let userInfo = new userInfoMetaDataModel({
        _id: req.user._id,
        status: 'active',
        name: req.user.name,
        email: req.user.email,
    })

    userInfo.save().then(result => {
        console.log(result)
        if(result)
            res.send({saved: true, msg: "user meta data saved"})
        else
            res.send({saved: false, msg: "user meta data not saved"})
    }).catch(err => {
        console.log(err)
        res.send({saved: false, msg: "user meta data not saved"})
    })

})

module.exports = router