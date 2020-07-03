const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage')
const authUtil = require('../module/authUtil')
const pool = require('../module/pool')

const board = {
    boardlist: async (req, res) => {
        const table = 'board'
        const result = await pool.queryParam_None(`SELECT * FROM ${table} `)

        if(!result){
            return{
                code: statusCode.DB_ERROR,
                json: authUtil.successFalse(responseMessage.DB_FAIL)
            }
        }


    }
}
module.exports = board