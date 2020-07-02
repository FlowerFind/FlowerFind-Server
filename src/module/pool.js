const poolPromise = require('../../config/dbPool')

module.exports = {
    queryParam_None: async (...args) => {
        const query = args[0]
        let result
        const pool = await poolPromise

        console.log("pool.js")

        try {
            var connection = await pool.getConnection()
            result = await connection.query(query) || null
        }catch (err) {
            console.log(err)
            connection.rollback(() => {})
        }finally {
            pool.releaseConnection(connection)
            return result
        }
    },
    queryParam_Arr: async (...args) => {
        const query = args[0]
        const value = args[1]
        let result
        try{
            var connection = await pool.getConnection()
            result = await connection.query(query, value) || null
        } catch (err) {
            connection.rollback(() => {})
            next(err)
        } finally {
            pool.releaseConnection(connection)
            return result
        }
    },
    queryParam_Parse: async (inputquery, inputvalue)=>{
        const query = inputquery
        const value = inputvalue
        let result
        try{
            var connection = await pool.getConnection()
            result = await connection.query(query, value) || null
            console.log(result)
        } catch (err) {
            console.log(err)
            connection.rollback(() => {})
            next(err)
        } finally {
            pool.releaseConnection(connection)
            return result
        }
    },
    Transaction: async (...args) => {
        let result = "Success"

        try {
            var connection = await pool.getConnection()
            await connection.beginTransaction()
            await args[0](connection, ...args)
            await connection.commit()
        }catch (err) {
            await connection.rollback()
            console.log("mysql error! err log =>" +err)
            result = undefined
        }finally {
            pool.releaseConnection(connection)
            return result
        }
    }
}