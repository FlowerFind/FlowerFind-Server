const express = require('express')
const router = express.Router()
const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage');
const authUtil = require('../module/authUtil')
const upload = require('../../config/multer')
const pool = require('../module/pool')
const Boards = require('../model/board')

var moment = require('moment')
const table = 'board'

//게시글 별 디테일
router.get('/getboarddetail', function (req, res) {

    const boardIdx = req.query.boardIdx

    Boards.getboarddetail(boardIdx)
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(500, authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

//게시글 전체 리스트
router.get('/getboardlist', async (req, res) =>{

    Boards.getboardlist()
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err);
            res.status(500, authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

//사용자별로 업로드한 게시글
router.get('/getboard',function (req, res) {
    const userIdx = req.query.userIdx

    Boards.getboard(userIdx)
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err)
            res.status(500, authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

//댓글 달기
router.post('/writecomment', async (req, res) => {
    const {
        userIdx,
        text,
        boardIdx
    } = req.body

    if (!userIdx || !text || !boardIdx) {
        res.status(500)
            .send(authUtil.successFalse(responseMessage.NULL_VALUE));
        return
    }

    Boards.writecomment(userIdx, text, boardIdx)
        .then(({code, json}) => res.status(code).send(json))
        .catch(err => {
            console.log(err)
            res.status(500, authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

//게시글 업로드
router.post('/upload', upload.single('image'), async (req, res) => {
    const {
        oom,
        userIdx,
        text
    } = req.body

    const date = moment().format("YYYY-MM-DD")
    const urlresult = req.file.location
    const nickname = await pool.queryParam_None(`SELECT name FROM user WHERE userIdx = '${userIdx}'`)

    async function imgupload(oom, userIdx, text) {
        const fields = 'date, url, oneormany, userIdx, text, username'
        const resultInput = await pool.queryParam_None(`INSERT INTO ${table}(${fields}) VALUES ('${date}','${urlresult}','${oom}', '${userIdx}', '${text}','${nickname[0].name}')`)

        if (!resultInput) {
            return {status: statusCode.DB_ERROR, message: 'err'}
        } else {
            if (!oom || !userIdx || !text) {
                return {
                    code: statusCode.NOT_FOUND,
                    json: authUtil.successFalse(responseMessage.BOARD_UPLOAD_FAIL)
                }
            } else {
                return {
                    code: statusCode.OK,
                    json: {
                        message: responseMessage.BOARD_UPLOAD_SUCCESS
                    }
                }
            }
        }
    }

    imgupload(oom, userIdx, text)
        .then(({code, json}) =>
            res.status(code).send(json))
        .catch(err => {
            console.log(err)
            res.status(statusCode.INTERNAL_SERVER_ERROR,
                authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

module.exports = router