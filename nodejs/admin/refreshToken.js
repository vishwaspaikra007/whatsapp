const express = require('express')
const router = express.Router()

router.get('/refreshToken', (req, res) => refreshTokenFunc(req, res))

module.exports = router