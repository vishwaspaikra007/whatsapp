const userPasswordModel = require('../database/models/userPasswordModel')
const jwt = require('jsonwebtoken')
const signJWT = require('./jwt')
const dotenv = require('dotenv')
dotenv.config()

module.exports = ()=> { 
    refreshTokenFunc = (req, res) => {
        if (req.cookies.refreshToken) {
            // console.log(req.cookies.refreshToken)
            jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_KEY, (err, data) => {
    
                if(err)
                    res.send({logedIn: false, msg:"login again"})
                // console.log(data, data.sub)
                userPasswordModel.updateOne({_id: data.sub}, {$pull: {refreshTokens: req.cookies.refreshToken}})
                .then(result => {
                    // console.log("deleted client old refresh token", result)
                    if(result.n) {
                        let payloadData = {
                            age: 24,
                            post: 40
                        }
        
                        const signedJWT = signJWT({id: data.sub, payloadData: payloadData})
                        const signedRefreshJWT = signJWT({id: data.sub},"refresh")
        
                        const cookieOptions = {
                            httpOnly: true,
                            expires: 0 ,
                            sameSite: 'none',
                            secure: JSON.parse(process.env.PRODUCTION) ? true : false
                        }
        
                        userPasswordModel.updateOne({_id: data.sub}, {$push: {refreshTokens: signedRefreshJWT}})
                        .then(result => {
                            if(result.n) {
                                userPasswordModel.findById(data.sub).then(user => {
                                    if(user) {
                                        // console.log("added new refresh token", result)
                                        res.cookie("refreshToken",signedRefreshJWT, cookieOptions)
                                        res.send({logedIn: true, msg:"login successfull",email: user.toObject().email,  signedJWT})
                                    } else {
                                        res.send({logedIn: true, msg:"refresh token generation failed", signedJWT})
                                    }
                                    
                                })
                            }  else {
                                res.send({logedIn: true, msg:"refresh token generation failed", signedJWT})
                            }
                        })
                        .catch(err => {
                            console.log("error", err)
                            res.send({logedIn: true, msg:"refresh token generation failed", signedJWT})
                        })
                    } else {
                        res.clearCookie("refreshToken")
                        res.send({logedIn: false, msg:"invalid refresh token login again"})
                    }
                    
    
                })
                .catch(err => {
                    console.log(err)
                    res.status(401).send({logedIn: false, msg: "unauthorized login again"})
                })
            })
                
                
        } else {
            // console.log(req.cookies)
            res.send({logedIn: false, msg:"user doesn't exist"})
        }
    }
}