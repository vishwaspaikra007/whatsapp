const express = require('express')
const router = express.Router()
const userPasswordModel = require('../database/models/userPasswordModel')
const bcrypt = require('bcrypt')
const signJWT = require('./jwt')
const dotenv = require('dotenv')

dotenv.config()

router.post('/login', (req, res, next)=> {
    console.log(req.body, "\n", req.cookies)
    userPasswordModel.findOne({email: req.body.email}).select('+password')
        .then(user => {
            console.log(user)
            if(user){ 
                bcrypt.compare(req.body.PWD, user.password, (err, result)=> {
                    if(result)
                     {
                        let payloadData = {
                            age: 24,
                            post: 40
                        }

                        const signedJWT = signJWT({id:user.id, payloadData: payloadData})
                        const signedRefreshJWT = signJWT({id:user.id},"refresh")

                        const cookieOptions = {
                            httpOnly: true,
                            expires: 0 ,
                            sameSite: 'none',
                            secure: JSON.parse(process.env.PRODUCTION) ? true : false
                        }
                        
                        if(req.cookies.refreshToken) {
                            userPasswordModel.updateOne({_id: user._id}, {$pull: {refreshTokens: req.cookies.refreshToken}}).then(result => {
                                console.log("deleted client old refresh token", result)
                            }).catch(err => {
                                console.log("error in deleting old refresh token", err)
                            })
                        }
                        
                        
                        userPasswordModel.updateOne({_id: user._id}, {$push: {refreshTokens: signedRefreshJWT}})
                            .then(result => {
                                console.log(result)
                                if(result.n) {
                                    res.cookie("refreshToken",signedRefreshJWT, cookieOptions)
                                    res.send({logedIn: true, msg:"login successfull", signedJWT})
                                } else {
                                    res.send({logedIn: true, msg:"login successfull refresh token generation failed", signedJWT})
                                }
                                
                            }).catch(err => {
                                res.status(401).send(err)
                            })

                    }
                    else
                    {
                        console.log("wrong password")
                        res.status(401).send()
                    }
                })
            } else {
                console.log("no user with this email")
                res.send({logedIn: false, msg:"login unsuccessfull check your email"})
            }
        }).catch(err => {
            res.send({logedIn: false, msg:"login unsuccessfull database error"})
        })
})

module.exports = router