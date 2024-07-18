import socketIoClient from 'socket.io-client'
import config from './config'

const socketAddess = config.production ? config.server : config.local
const socket = socketIoClient(socketAddess)

export default socket