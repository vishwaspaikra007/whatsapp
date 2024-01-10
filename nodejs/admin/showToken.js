const express = require('express')
const router = express.Router()

router.post('/showToken', (req, res) => {
    res.send(req.cookies)
})

module.exports = router