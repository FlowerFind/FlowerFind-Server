const { Router } = require('express')
const router = Router()

const users = require('./users')
const test = require('./dbTest')
const flowers = require('./flowers')
const jwtTest = require('./jwtTest')
const video = require('./youtube')
/* GET home page. */
router.use('/users', users)
router.use('/dbTest', test)
router.use('/flowers', flowers)
router.use('/jwtTest', jwtTest)
router.use('/youtube', video)


module.exports = router
