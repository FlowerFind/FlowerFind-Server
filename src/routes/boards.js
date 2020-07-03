const express = require('express')
const router = express.Router()
const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage');
const authUtil = require('../module/authUtil')
const upload = require('../../config/multer')
const pool = require('../module/pool')

var moment = require('moment')
const table = 'board'
router.post('/boardlist', async (req,res)=> {
    console.log(req.body)
    const boardlist = await pool.queryParam_None(`SELECT * FROM ${table} `)
    return {
        code: statusCode.OK,
        json: boardlist
    }
    res.send(json)
})
router.post('/uploads', upload.single('image'), async (req, res) => {
    const {
        oom,
        userIdx,
        text
    } = req.body

    const date = moment().format("YYYY-MM-DD")
    const urlresult = req.file.location

    async function imgupload(oom, userIdx, text) {
        const fields = 'date, url, oneormany, userIdx, text'
        const resultInput = await pool.queryParam_None(`INSERT INTO ${table}(${fields}) VALUES ('${date}','${urlresult}','${oom}', '${userIdx}', '${text}')`)

        const boardlist = await pool.queryParam_None(`SELECT * FROM ${table} `)

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
                        message: responseMessage.BOARD_UPLOAD_SUCCESS,
                        Date: date,
                        Url: urlresult,
                        OneorMany: oom,
                        UserIdx: userIdx,
                        Text: text
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