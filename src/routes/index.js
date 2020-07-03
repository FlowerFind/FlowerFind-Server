const { Router } = require('express')
const router = Router()

const users = require('./users')
const flowers = require('./flowers')
const jwtTest = require('./jwtTest')
const boards = require('./boards')

/* GET home page. */
router.use('/users', users)
router.use('/flowers', flowers)
router.use('/jwtTest', jwtTest)
router.use('/boards', boards)



module.exports = router
