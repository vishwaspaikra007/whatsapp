const express = require('express')
const app = express()
const cors = require('cors')

const path = require('path')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()

const socketIo = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketIo(server)
app.set('socketIo', io)
require('./admin/socket.io')(io)

const register = require('./admin/register')
const login = require('./admin/login')
const passport = require('./admin/passport')
const requestMail = require('./admin/requestMail')
const verifyOTP = require('./admin/verifyOTP')
const refreshToken = require('./admin/refreshToken')
const createRoom = require('./admin/createRoom')
const saveUserMetaData = require('./admin/userInfoMetaData')
const getContacts = require('./admin/getContacts')

require('./admin/customPassportAuthenticate')(passport)
require('./admin/refreshTokenFunc')()


app.use(cors(
    {origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3001','http://localhost:3000', 'https://vishwaspaikra007.github.io', 'https://vishwas-auth.herokuapp.com'],
     credentials: true}
     ))
app.options('*', cors())  // enable pre-flight request for complex cors request for every route
app.use(express.json())
app.use(passport.initialize())

app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))    
app.set('view engine', 'ejs')

app.use(register)
app.use(login)
app.use(requestMail)
app.use(verifyOTP)
app.use(refreshToken)
app.use(createRoom)
app.use(saveUserMetaData)
app.use(getContacts)
app.use(require('./admin/testRoute'))
app.get('/',(req, res) => {
    res.render('index.ejs')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("app is listening on port", PORT, " ", (new Date()).toString())
})
