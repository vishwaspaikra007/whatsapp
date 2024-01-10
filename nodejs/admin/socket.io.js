const roomMessageSchema = require('../database/schema/roomMessageSchema')
const mongoose = require('../database/database.config')
const userInfoModel = require('../database/models/userInfoMetaDataModel')
const socketFunc = (io)=> {
    io.on('connection', (socket) => {
        console.log("new client connected", socket.id)

        io.emit('chats', "hello everyone" + socket.id)

        socket.on('joinRoom', roomId => {
            socket.join(roomId)
            console.log("joined room with id: " + roomId)
        })

        socket.on('msgToServer', data => {
            console.log('data.msg', data.msgData.msg, "\n", data.roomId, "\n", data.msgData.senderName)
            socket.broadcast.to(data.roomId).emit('msgFromServer', {roomId: data.roomId, msgData: data.msgData})
            roomMSGModel = mongoose.model(data.roomId, roomMessageSchema)
            roomMSGModel.create(data.msgData).then(result => {
                console.log("saved msg", result)
                const timestamp = Date.now()
                io.in(data.senderEmail).emit('msgStatus', {type: 'sent', timestamp: timestamp, roomId: data.roomId})

                userInfoModel.updateOne({
                    email: data.senderEmail,chats:{$elemMatch: {_id: data.roomId}}
                }, {
                    $set: {'chats.$.sent': timestamp}
                })
                .then(result => console.log("sent ", result))
                
            })
        })  

        socket.on('msgStatusToServer', data => {
            console.log("wertyuhdc asidhcjaslkc ", data.type)

            if(data.type == 'seen') {
                
                socket.to(data.senderEmail).emit('msgStatus', {type: data.type, timestamp: data.timestamp, roomId: data.roomId})

                userInfoModel.updateOne({
                    email: data.senderEmail,chats:{$elemMatch: {_id: data.roomId}}
                }, {
                    $set: {'chats.$.seen': data.timestamp}
                })
                .then(result => console.log("seen saved", result))
                .catch(err => console.log("seen error", err))

                userInfoModel.updateOne({
                    _id: data.receiverId,chats:{$elemMatch: {_id: data.roomId}}
                }, {
                    $set: {'chats.$.roomOpenedTimestamp': data.timestamp}
                })
                .then(result => console.log("roomOpenedTimestamp saved", result))
                .catch(err => console.log("roomOpenedTimestamp error", err))

            } else {

                socket.to(data.senderId).emit('msgStatus', {type: data.type, timestamp: data.timestamp, roomId: data.roomId})

                userInfoModel.updateOne({
                    _id: data.senderId,chats:{$elemMatch: {_id: data.roomId}}
                }, {
                    $set: {'chats.$.received': data.timestamp}
                })
                .then(result => console.log("received saved", result))
                .catch(err => console.log("received error",err))
            }
            
        })
        
        socket.on('disconnect', ()=> {
            console.log("user disconnected with id", socket ? socket.id : "undefined socket")
        })  

    })

    console.log("yuheee")
}

module.exports = socketFunc