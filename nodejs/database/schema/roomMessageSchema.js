const mongoose = require('../database.config')
const schema = mongoose.Schema

const roomMessageSchema = new schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = roomMessageSchema