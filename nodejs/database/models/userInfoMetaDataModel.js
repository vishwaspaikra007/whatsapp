const mongoose = require('../database.config')
const schema = mongoose.Schema

const userInfoMetaDataSchema = new schema({
    _id: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        required: true,
        default: Date.now()
    },
    img: {
        type: String,
        default: "defaultImg"
    },
    status: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contacts: [String],
    chats: {
        type: [{
            _id: {
                type: String,
                required: true,
                unique: true
            },
            recipientId: {
                type: String,
                required: true,
                unique: true
            },
            timestamp: {
                type: Date,
                default: Date.now()
            },
            seen: Date,
            received: Date,
            sent: Date,
            roomOpenedTimestamp: Date
        }]
    },
    groups: [String]
})

module.exports = mongoose.model('userInfoMetaData', userInfoMetaDataSchema)