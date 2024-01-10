const express = require('express')
const router = express.Router()
const passport = require('passport')
const { v5: uuidv5 } = require('uuid');
const userInfoModel = require('../database/models/userInfoMetaDataModel')

require('./customPassportAuthenticate')(passport)

router.get('/check', (req, res) => {

    // console.log(uuidv5('vishwas', 'qwertyuiopasdfgh'))
    // res.send(uuidv5('vishwas', 'qwertyuiopasdfgh'))
    // console.log(req.app.get('socketIo'))
    // req.app.get('socketIo').to('vishwaspaikra007@gmail.com').emit('newChat', 'hello test')

    // userInfoModel.updateOne({email: 'vishwaspaikra912fake2@gmail.com',chats:{$elemMatch: {_id: '649c8e71-5a07-4799-b1d2-845d2c9558e6fake2'}}}, {$set: {'chats.$.read': '0'}}).then(result => {
    //     // console.log(result)
    //     res.send(result)
    // })

    // userInfoModel.findOne({email: 'vishwaspaikra912fake@gmail.com'}, {chats: {$elemMatch: {_id: '649c8e71-5a07-4799-b1d2-845d2c9558e6fake'}}}).then(result => {
    //     console.log(result.chats[0].receipient)
    //     res.send(result.chats[0])
    // })

     userInfoModel.updateMany({_id: {$in: ['5ef85b40e6a5c313b3b4e6aafake', '5f159803e73be39491d6e58cfake2']},chats:{$elemMatch: {_id: {$in: ['649c8e71-5a07-4799-b1d2-845d2c9558e6fake','93ab14bd-cb09-4400-8585-2acd673f8edcfake2']}}}}, {$set: {'chats.$.seen': Date.now()}}).then(result => {
        // console.log(result)
        res.send(result)
    })

    // userInfoModel.find({_id: {$in: ['5ef85b40e6a5c313b3b4e6aafake', '5f159803e73be39491d6e58cfake2']}},{chats:{$elemMatch: {_id: {$in: ['649c8e71-5a07-4799-b1d2-845d2c9558e6fake','93ab14bd-cb09-4400-8585-2acd673f8edcfake2']}}}}).then(result => {
    //     // console.log(result)
    //     res.send(result)
    // })
        
}
    // console.log(user)
)

module.exports = router