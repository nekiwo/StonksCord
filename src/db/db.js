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
    GetStockData: (code, isInvite) => {
        return new Promise(resolve => {
            if (!isInvite) {
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
             SET time_stamps = array_append(time_stamps, NOW()::timestamp)
             WHERE id = $1;`,
            [code]
        );
    },

    CreateStockData: (id, guildId, invite, members) => {
        sendQuery(
            `INSERT INTO stocks
             VALUES ($1, $2, $3, ARRAY [$4], ARRAY [0], ARRAY [NOW()]);`, 
            [id, guildId, invite, members]
        );
    },

    GetUserData: (id) => {
        return new Promise(resolve => {
            sendQuery(
                "SELECT * FROM users WHERE id = $1;", 
                [id]
            ).then(data => {
                resolve(data[0]);
            });
        });
    },

    UpdateUserData: (id) => {
        
    },

    CreateUserData: (id) => {
        sendQuery(
            `INSERT INTO users
             VALUES ($1, 100, ARRAY[]::text[]);`,
            [id]
        );
    }
};