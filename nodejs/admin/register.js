const express = require('express')
const router = express.Router()
const userPasswordModel = require('../database/models/userPasswordModel')
const bcrypt = require('bcrypt')
const signJWT = require('./jwt')
const dotenv = require('dotenv')

dotenv.config()

router.post('/register',(req, res) => {
    userPasswordModel.findOne({email: req.body.email})
        .then((user)=> {
            console.log(user)
            if(user)
                res.send({registered: false, msg: "User already exist"})
            else
            {    
                console.log("doesn't exist")
                bcrypt.hash(req.body.PWD, 10, (err, hash)=> {
                    userPasswordModel.create({
                        email: req.body.email,
                        password: hash,
                        name: req.body.name
                    })
                    .then((user)=> {

                        

                        let payloadData = {}
                        const signedJWT = signJWT({id:user._id, payloadData: payloadData})
                        const signedRefreshJWT = signJWT({id:user._id},"refresh")

                        const cookieOptions = {
                            httpOnly: true,
                            expires: 0 ,
                            sameSite: 'none',
                            secure: JSON.parse(process.env.PRODUCTION) ? true : false
                        }
                        userPasswordModel.updateOne({_id: user._id}, {$push: {refreshTokens: signedRefreshJWT}})
                            .then(result => {
                                console.log(result)
                                if(result.n) {
                                    res.cookie("refreshToken",signedRefreshJWT, cookieOptions)
                                    res.status(201).send({registered: true, msg:"registration successfull", signedJWT})
                                } else {
                                    res.status(201).send({registered: true, msg:"registration successfull refresh token generation failed", signedJWT})
                                }
                                
                            }).catch(err => {
                                res.send({registered: false, msg: err})
                            })
                        
                    }).catch(err => {
                        console.log(err)
                        res.send({registered: false, msg: err})
                    })
                })
            }
        }).catch(err => {
            console.log(err)
            res.send({registered: false, msg: err})
        })
})

module.exports = router