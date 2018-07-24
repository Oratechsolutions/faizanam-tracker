var mysql = require('mysql'),
    config = {
        host: "localhost",
        user: "root",
        password: "",
        database: "faizanam",
        dateStrings: true
    }
class Database {
    constructor() {
        this.conn = mysql.createPool(config)
    }
    /**
     * 
     * @param {string} sql sql statement to execute
     * @param {object} obj optional object to insert or fetch
     * @param {Function} callback function with result set
     */
    query(sql, obj, callback) {
        if (typeof sql == "undefined")
            throw new Error("expected statement but found none")
        if (typeof obj == "function") {
            callback = obj
            this.conn.query(sql, (err, results) => {
                err ? callback(err) : callback(results)
            })
        }
        if (typeof obj == "object") {
            this.conn.query(sql, obj, (err, results) => {
                err ? callback(err) : callback(results)
            })
        }
    }
    async queryAsync(sql, data) {
        return new Promise(async (resolve, reject) => {
            if (typeof sql == 'undefined')
                return reject({ error: 'Required sql to execute' })
            if (typeof data == 'undefined')
                await this.conn.query(sql, (err, rows, fields) => err ? reject({ error: err }) : resolve(rows))
            else
                await this.conn.query(sql, data, (err, rows, fields) => err ? reject({ error: err }) : resolve(rows))
        })

    }
}

module.exports = new Database()