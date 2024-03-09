const express = require('express')
const customPassportAuthenticate = require('./customPassportAuthenticate')
const router = express.Router()

const userPasswordModel = require('../database/models/userPasswordModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { stringify } = require('uuid')
dotenv.config()

router.post('/logout', (req, res) => {
    console.log("logging out ", req.cookies.refreshToken)
    
    if(req.cookies.refreshToken) {
        const refreshToken = req.cookies.refreshToken
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, data) => {
            
            if(err) {
                res.send({logedIn: false, msg:"login again"})
                return
            }

            userPasswordModel.updateOne({_id: data.sub}, {$pull: {refreshTokens: refreshToken}}).then(result => {
                console.log("removed refresh token from database")
                res.clearCookie("refreshToken");
                res.status(200).send({})
            }).catch(err => {
                console.log(err);
                res.sendStatus(500) // server error
            })
        })
        
    } else {
        res.sendStatus(403) // forbidden
    }

})

module.exports = router