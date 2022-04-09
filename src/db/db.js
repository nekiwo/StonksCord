const fs = require("fs");
const {Pool} = require("pg");

const config = JSON.parse(fs.readFileSync("./config.json"));
const pool = new Pool(config.DBConfig.db);


const sendQuery = (query, params) => pool.query(query, params).then(
    results => results.rows
).catch(
    _err => []
);


module.exports = {
    GetStockData: (code, IsInvite) => {
        return new Promise(resolve => {
            if (!IsInvite) {
                sendQuery(
                    "SELECT * FROM stock WHERE id=$1;", 
                    [code]
                ).then(data => {
                    console.log("GetStockData", data)
                    resolve(data[0]);
                });
            } else {
                sendQuery(
                    "SELECT * FROM stock WHERE invite=$1;", 
                    [code]
                ).then(data => {
                    console.log("GetStockData", data)
                    resolve(data[0]);
                });
            }
        });
    }
};