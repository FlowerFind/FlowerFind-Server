const express = require('express')
const router = express.Router()
const responseMessage = require('../module/responseMessage')
const statusCode = require('../module/statusCode')
const authUtil = require('../module/authUtil')
const jwt = require('../module/jwt')

router.post('/sign', (req, res) => {
    const dummy = req.body
    const result = jwt.sign(dummy)
    res.json(result)
})


router.post('/verify', (req, res) => {
    const token = req.headers
    const result = jwt.verify(token)

    if(result.isError){
        const {code, json} = result.data;
        if(code && json) {
            return res.status(code).send(authUtil.successFalse(json));
        }
        const err = result.data;
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(authUtil.successFalse(err.message));
    }
    if(result == -1) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(authUtil.successFalse(responseMessage.EXPIRED_TOKEN));
    }
    if(result == -2) {
        return res.status(statusCode.UNAUTHORIZED)
            .send(authUtil.successFalse(responseMessage.INVALID_TOKEN));
    }
    res.json(result.data);
})

module.exports = router