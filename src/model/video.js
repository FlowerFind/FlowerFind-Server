const statusCode = require('../module/statusCode')
const responseMessage = require('../module/responseMessage')
const authUtil = require('../module/authUtil')

const video = {
    youtube: async (flowername) => {
        let value = encodeURI("꽃꽂이")
        let optionParams = {
            q: value,
            part: "snippet",
            key: "AIzaSyCHnkisEUGBQS-78D0TKJ67N3dsNDVAgk8",
            maxResults: 5
        }

        let url = "https://www.googleapis.com/youtube/v3/search?";
        for (let option in optionParams) {
            url += option + "=" + optionParams[option] + "&";
        }

        //url의마지막에 붙어있는 & 정리
        url = url.substr(0, url.length - 1);
        const result = request(url)
        if (!result) {
            return {status: 500, message: 'error'}
        } else {
            if (result.length > 0) {
                return {
                    code: 200,
                    json: authUtil.successTrue(responseMessage.FLOWER_INFO_SUCCESS, result)
                    //json: authUtil.successTrue(responseMessage.FLOWER_INFO_SUCCESS, result)
                }
            } else {
                return {
                    code: 500,
                    json: authUtil.successFalse(responseMessage.FLOWER_INFO_FAIL)
                }
            }

        }
    }
}

module.exports = video