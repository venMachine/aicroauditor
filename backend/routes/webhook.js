const express = require('express')
const router = express.Router()

router.post('/yookassa', (req, res) => res.sendStatus(200))
router.post('/lemonsqueezy', (req, res) => res.sendStatus(200))

module.exports = router
