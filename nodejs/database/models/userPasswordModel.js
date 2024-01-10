const mongoose = require('../database.config')
let schema = mongoose.Schema

const AuthenticatedUser = new schema({
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
        select: false
    },
    name: String,
    refreshTokens: {
        type: [String],
        select: false
    },
    img: {
        type: String,
        default: "defaultImg"
    }
})
const User = mongoose.model('userPassword', AuthenticatedUser)
module.exports = User