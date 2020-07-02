const express = require('express')
const router = express.Router()
const responseMessage = require('../module/responseMessage');
const authUtil = require('../module/authUtil')
var request = require('request')
var value = encodeURI("꽃꽂이")
const Video = require('../model/video')

router.post('/youtube', (req, res) => {
    Video.youtube(req.body)
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err)
            res.status(500,
                authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

module.exports = router