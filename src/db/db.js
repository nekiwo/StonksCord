const fs = require("fs");
const {Pool} = require("pg");

const config = JSON.parse(fs.readFileSync("./config.json"));
const pool = new Pool(config.DBConfig.db);


const sendQuery = (query, params) => pool.query(query, params).then(
    results => results.rows
).catch(
    err => {console.log(err); return []}
);


module.exports = {
    GetStockData: (code, IsInvite) => {
        return new Promise(resolve => {
            if (!IsInvite) {
                sendQuery(
                    "SELECT * FROM stocks WHERE id = $1;", 
                    [code]
                ).then(data => {
                    resolve(data[0]);
                });
            } else {
                sendQuery(
                    "SELECT * FROM stocks WHERE invite = $1;", 
                    [code]
                ).then(data => {
                    resolve(data[0]);
                });
            }
        });
    },
    
    UpdateStockData: (code, members, shares) => {
        console.log("update")
        sendQuery(
            `UPDATE stocks 
             SET members = array_append(members, $1)
             WHERE id = $2;`,
            [members, code]
        );

        sendQuery(
            `UPDATE stocks 
             SET total_shares = array_append(total_shares, $1)
             WHERE id = $2;`,
            [shares, code]
        );

        sendQuery(
            `UPDATE stocks 
             SET time_stamp = array_append(time_stamp, $1)
             WHERE id = $2;`,
            [Date.now(), code]
        );
    }
};