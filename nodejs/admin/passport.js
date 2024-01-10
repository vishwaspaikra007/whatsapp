const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const dotenv = require('dotenv')
const userPasswordModel = require('../database/models/userPasswordModel')

dotenv.config()
let options = {}

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.TOKEN_KEY

passport.use(new JwtStrategy(options, (jwt_payload, done)=> {
    userPasswordModel.findOne({_id: jwt_payload.sub}, (err, user)=> {
        if(err) {
            done(err, false)
        }
        if(user) {
            done(null, user.toObject())
        } else {
            done(null, false)
        }
    })
}))    

module.exports = passport