const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const tokenKey = process.env.TOKEN_KEY
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY

const options = {
    algorithm: 'HS256',
    expiresIn: '15m'
}
function signJWT(user, type) {
    
    let payload = {
        sub: user.id,
    }
    if(type === "refresh")
        return jwt.sign(payload, refreshTokenKey)

    for(let key in user.payloadData)
        payload[key]=user.payloadData[key]

    return jwt.sign(payload, tokenKey, options)
}

module.exports =  signJWT