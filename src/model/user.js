const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage')
const authUtil = require('../module/authUtil')
const pool = require('../module/pool')

const user = {
    signin: async (id, pw) => {
        const table = 'user'
        const result = await pool.queryParam_None(`SELECT *FROM ${table}`)
        if (!result) {
            return {status: 500, message: 'error'}
        }
        //아이디 존재하는 지 확인
        const arr = result.filter(it => it.id == id)
        const user = arr[0]
        if (arr.length == 0) {
            return {
                code: statusCode.BAD_REQUEST,
                json: authUtil.successFalse(responseMessage.NO_USER)
            }
        }else if(user.pw != pw){
            return {
                code: statusCode.UNAUTHORIZED,
                json: authUtil.successFalse(responseMessage.MISS_MATCH_PW)
            }
        }else{
            return {
                code: 200,
                json: authUtil.successTrue(responseMessage.SIGN_IN_SUCCESS)
            }
        }
    },
    signup: async (id, pw, name) => {

        const table = 'user'
        const fields = 'id, pw, name'
        const result = await pool.queryParam_None(`INSERT INTO ${table}(${fields}) VALUES('${id}','${pw}','${name}')`)

        if (!result) {
            return {status: 500, message: 'error'}
        }

        return {
            code: 200,
            json: authUtil.successTrue(responseMessage.SIGN_UP_SUCCESS)
        }
    },

    checkid: async (id) => {
        const table = 'user'
        const field = 'id'
        const result = await pool.queryParam_None(`SELECT *FROM ${table}`)
        if (!result) {
            return {status: 500, message: 'error'}
        } else {
            if (result.filter(it => it.id == id).length == 0) {
                return {
                    code: 200,
                    json: authUtil.successTrue(responseMessage.USE_ID)

                }
            } else {
                return {
                    code: 500,
                    json: authUtil.successFalse(responseMessage.ALREADY_ID)
                }
            }
        }
    }
}
module.exports = user