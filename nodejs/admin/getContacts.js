const express = require('express')
const router = express.Router()
const userInfoMetaDataModel = require('../database/models/userInfoMetaDataModel')
const roomMessageSchema = require('../database/schema/roomMessageSchema')
const mongoose = require('mongoose')

function rooms(roomId) {
    return new Promise((resolve, reject) => {
        const roomModel = mongoose.model(roomId, roomMessageSchema)
        roomModel.find({}).sort({'_id': 1}).then(result => {
            // console.log(result)
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}

router.post('/getContacts', (req, res, next)=> customPassportAuthenticate(req, res, next), (req, res) => {
    userInfoMetaDataModel.findOne({_id: req.user._id})
        .then(user => {
            // console.log("user", user)
            const userData = {
                _id: user._id, name: user.name, email: user.email
            }
            // console.log("userData", userData)
            let contactsId = []
            user.chats.map(obj => {
                contactsId.push(obj.recipientId)
            })
            userInfoMetaDataModel.find({_id: {$in: contactsId}}).select('name email')
                .then(async usersInfo => {
                    // console.log("usersInfo", usersInfo)
                    
                    const usersInfoModified = usersInfo.map(obj => {
                        let obj2 = {
                        recipientId: obj._id,
                        ...obj.toObject()
                        }
                        delete obj2['_id']
                        return obj2
                    })
                    // console.log("usersInfoModified", usersInfoModified)

                    const contacts = usersInfoModified.map(obj => ({
                        ...user.chats.find(chat => chat.recipientId === obj.recipientId && chat).toObject(), ...obj
                    }))
                    
                    let roomsMessages = {}
                    for(const index in contacts) {
                        // console.log(contacts[index]._id)
                        roomsMessages[contacts[index]._id] = await rooms(contacts[index]._id)
                    }
                    
                    // console.log('roomsMessages', roomsMessages)
                    // console.log("contacts", contacts)
                    res.send({contacts: contacts, roomsMessages, userData})

                }).catch(err => {
                    res.send(err)
                })
        }).catch(err => {
            res.send(err)
        })
})

module.exports = router