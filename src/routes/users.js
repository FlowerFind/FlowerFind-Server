
const express = require('express')
const router = express.Router()
const responseMessage = require('../module/responseMessage');
const authUtil = require('../module/authUtil')
const User = require('../model/user')


router.post('/signup', (req, res) => {
    const {
        id,
        pw,
        name
    } = req.body
    console.log(id, pw, name)
// TODO 1: 파라미터 값 체크
    if (!id || !pw || !name) {
        res.status(500)
            .send(authUtil.successFalse(responseMessage.NULL_VALUE));
        return
    }
    User.signup(id, pw, name)
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(500, authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        });

})
router.post('/checkid', async (req, res) => {
    const {
        id
    } = req.body

    User.checkid(id)
        .then(({code, json}) => res.status(200).send(json))
        .catch(err => {
            console.log(err)
            res.status(500,
                authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })

})
router.post('/signin', async (req, res) => {
    const {
        id,
        pw
    } = req.body
    console.log(id, pw)

    User.signin(id, pw)
        .then(({code, json}) => res.status(200).send(json))
        .catch(err => {
            console.log(err)
            res.status(500,
                authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

module.exports = router
