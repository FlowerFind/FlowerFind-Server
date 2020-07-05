const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage')
const authUtil = require('../module/authUtil')
const pool = require('../module/pool')

var moment = require('moment')
const board = {

    //게시글 리스트 보여주기
    getboardlist: async () => {
        const table = 'board'
        const result = await pool.queryParam_None(`SELECT * FROM ${table}`)

        if (!result) {
            return {
                code: statusCode.DB_ERROR,
                json: authUtil.successFalse(responseMessage.DB_FAIL)
            }
        } else {
            return {
                code: statusCode.OK,
                json: result
            }
        }
    },
    //사용자가 올린 게시글 보여주기
    getboard: async (userIdx) => {
        const table = 'board'
        const result = await pool.queryParam_None(`SELECT * FROM ${table} WHERE userIdx = '${userIdx}'`)

        if (!result) {
            return {
                code: statusCode.DB_ERROR,
                json: authUtil.successFalse(responseMessage.DB_FAIL)
            }
        } else {
            return {
                code: statusCode.OK,
                json: result
            }
        }
    },

    //게시글 디테일 보여주기
    getboarddetail: async (boardIdx) => {

        const boardresult = await pool.queryParam_None(`SELECT * FROM board WHERE boardIdx = '${boardIdx}'`)
        const commentresult = await pool.queryParam_None(`SELECT * FROM comment WHERE boardIdx = '${boardIdx}'`)

        if (!boardresult || !commentresult) {
            return {
                code: statusCode.DB_ERROR,
                json: authUtil.successFalse(responseMessage.DB_FAIL)
            }
        } else {
            return {
                code: statusCode.OK,
                json: {
                    board: boardresult,
                    comment: commentresult
                }
            }
        }
    },
    //댓글달기
    writecomment: async (userIdx, text, boardIdx) => {
        const table = 'comment'
        const fields = 'commenterIdx, date, text, boardIdx, commentername'

        const date = moment().format("YYYY-MM-DD")
        const nickname = await pool.queryParam_None(`SELECT name FROM user WHERE userIdx = '${userIdx}'`)

        const result = await pool.queryParam_None(`INSERT INTO ${table}(${fields}) VALUES ('${userIdx}', '${date}', '${text}', '${boardIdx}', '${nickname[0].name}') `)

        if (!result) {
            return {
                code: statusCode.DB_ERROR,
                json: authUtil.successFalse(responseMessage.DB_FAIL)
            }
        } else {
            return {
                code: statusCode.OK,
                json: authUtil.successTrue(responseMessage.COMMENT_SUCCESS)
            }
        }
    }

}
module.exports = board