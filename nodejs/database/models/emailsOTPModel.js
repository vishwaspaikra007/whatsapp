const mongoose = require('../database.config')
let schema = mongoose.Schema

const emailsOTPSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
}, {timestamps: true})

emailsOTPSchema.index({createdAt: 1},{expireAfterSeconds: 120})
module.exports = mongoose.model('emailsOTP', emailsOTPSchema)