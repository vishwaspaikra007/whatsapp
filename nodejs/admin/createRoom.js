const express = require('express')
const router = express.Router()
const userPasswordModel = require('../database/models/userPasswordModel')
const { v4: uuidv4 } = require('uuid');
const roomMessageSchema = require('../database/schema/roomMessageSchema')
const mongoose = require('../database/database.config')
const userInfoMetaDataModel = require('../database/models/userInfoMetaDataModel')

router.post('/createRoom',  (req, res, next) => customPassportAuthenticate(req, res, next), (req, res) => {
    userPasswordModel.findOne({email: req.body.email})
        .then(user => {

            if(user)
            {   
                console.log("user exist ", user)
                console.log("auth user", req.user)
                let userInfo = new userInfoMetaDataModel()
                userInfoMetaDataModel.findOne({_id: req.user._id ,chats: {$elemMatch: {recipientId: user._id}}}).select('chats')
                    .then(result => {
                        console.log("find", result)
                        if(result) {
                            res.send({roomCreated: false, msg: "chat room with this user already exist"})
                        } else {
                            const chatRoomId = uuidv4()
                            const recipientId1 = req.user._id
                            const recipientId2 = user._id

                            userInfoMetaDataModel.updateOne(
                                { _id: recipientId2}, 
                                {$addToSet : { chats: {_id: chatRoomId, recipientId: recipientId1 }}}
                            ).then(result => {
                                console.log("user info 1" , result)
                                if(result) {
                                    userInfoMetaDataModel.updateOne(
                                        { _id: recipientId1}, 
                                        {$addToSet : { chats: {_id: chatRoomId, recipientId: recipientId2}}}
                                    ).then(result => {
                                        console.log("user info 2" , result)
                                        if(result) {
                                            let roomMessageModel = mongoose.model(chatRoomId, roomMessageSchema)

                                            const msgData = {
                                                senderId: 'bot1',
                                                senderName: 'bot2',
                                                msg: 'messages are not encrypted yet',
                                                timestamp: Date.now()
                                            }
                                            let roomMessage = new roomMessageModel(msgData)

                                            roomMessage.save().then(result => {
                                                console.log("after bot" + result)
                                                if(result){

                                                    req.app.get('socketIo').to(user.email).emit('newChat', {contact: { _id: chatRoomId, recipientId: recipientId1, name: req.user.name, lastMessageData: msgData }})

                                                    res.send({roomCreated: true, msg: "room successfuly created", contact: { _id: chatRoomId, recipientId: recipientId2, name: user.name, lastMessageData: msgData }})
                                                }
                                            }).catch(err => {
                                                console.log("after bot", err)
                                                res.send({roomCreated: false, msg: err})
                                            })
                                        }
                                    }).catch(err => {
                                        console.log("userInfo 2", err)
                                        res.send({roomCreated: false, msg: err})
                                    })
                                }
                            }).catch(err => {
                                console.log("userInfo 1", err)
                                res.send({roomCreated: false, msg: err})
                            })
                        }
                    }).catch(err => {
                        console.log("find err", err)
                        res.send({roomCreated: false, msg: err})
                    })
            }
            else
            {   
                console.log("user doesn't exist")
                res.send({msg: "the user is not registered", roomCreated: false})    
            }
        }).catch(err => {
            console.log(err)
            res.send(err)
        })
})


module.exports = router