const express = require('express')
const router = express.Router()
const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage');
const authUtil = require('../module/authUtil')
const upload = require('../../config/multer')
const pool = require('../module/pool')

//img url 저장, 꽃정보 보여줌
router.post('/flowerinfo', upload.single('image'), async (req, res) => {
    const flowername = req.body //판별결과 꽃 이름

//s3에 이미지 저장하고, 꽃이름과 맞는 idx와, url을 image테이블에 저장
    const imgtable = 'image'
    const fields = 'url, flowerIdx'
    const urlresult = req.file.location //url

    const idxresult = await pool.queryParam_None(`SELECT flowerIdx FROM flower WHERE name = "${flowername.name}"`) //idx
    const imgresult = await pool.queryParam_None(`INSERT INTO ${imgtable}(${fields}) VALUES ('${urlresult}','${idxresult[0].flowerIdx}')`)
    const imglist = await pool.queryParam_None(`SELECT url FROM image WHERE flowerIdx = "${idxresult[0].flowerIdx}"`)

    async function flowerinfo(name) {

        const table = 'flower'
        const result = await pool.queryParam_None(`SELECT * FROM ${table} WHERE name = '${name.name}'`)

        if (!result) {
            return {status: statusCode.DB_ERROR, message: 'error'}
        } else {
            if (result.length > 0) {
                return {
                    code: statusCode.OK,
                    json: {
                        message: responseMessage.FLOWER_INFO_SUCCESS,
                        imgUrl: urlresult,
                        flowerInfo: result,
                        imgList: imglist
                    }
                }
            } else {
                return {
                    code: statusCode.NOT_FOUND,
                    json: authUtil.successFalse(responseMessage.FLOWER_INFO_FAIL)
                }
            }
        }
    }

    //multipart/form-data
//꽃 이름에 맞는 꽃정보 출력
    flowerinfo(req.body)
        .then(({code, json}) =>
            res.status(code).send(json))
        .catch(err => {
            console.log(err)
            res.status(statusCode.INTERNAL_SERVER_ERROR,
                authUtil.successFalse(responseMessage.INTERNAL_SERVER_ERROR))
        })
})

module.exports = router
