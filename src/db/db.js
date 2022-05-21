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
    GetStockData: (value, column) => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM stocks WHERE ${column} = $1;`, 
                [value]
            ).then(data => {
                resolve(data[0]);
            });
        });
    },

    GetStockMembersData: (id) => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM $1;`, 
                ["stock" + id]
            ).then(data => {
                resolve(data);
            });
        });
    },
    
    UpdateStockData: (code, members, shares, price) => {
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
             SET price = array_append(price, $1)
             WHERE id = $2;`,
            [price, code]
        );

        sendQuery(
            `UPDATE stocks 
             SET time_stamps = array_append(time_stamps, NOW()::timestamp without time zone)
             WHERE id = $1;`,
            [code]
        );
    },

    UpdateStockMembersData: (id, userId, messages) => {
        sendQuery(
            `SELECT * FROM $1 WHERE id = $2;`, 
            ["stock" + id, userId]
        ).then(data => {
            if (data.length === 0) {
                sendQuery(
                    `INSERT INTO $1
                     VALUES ($2, $3);`, 
                    [id, userId, messages]
                );
            } else {
                sendQuery(
                    `UPDATE $1 
                     SET messages_pastday = $3
                     WHERE id = $2;`,
                    ["stock" + id, userId, messages]
                );
            }
        });
    },

    CreateStockData: (id, guildId, invite, members) => {
        sendQuery(
            `INSERT INTO stocks
             VALUES ($1, $2, $3, ARRAY [$4::integer]::integer[], ARRAY [0]::integer[], ARRAY [NOW()::timestamp without time zone]::timestamp without time zone[]);`, 
            [id, guildId, invite, members]
        );
    },

    CreateStockMembersData: (id) => {
        sendQuery(
            `CREATE TABLE $1 (
                 id text PRIMARY KEY UNIQUE,
                 messages_pastday int 
             );`, 
            ["stock" + id]
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

    UpdateUserBalance: (id, balance) => {
        sendQuery(
            `UPDATE users
             SET balance = $2
             WHERE id = $1;`,
            [id, balance]
        );
    },

    UpdateUserStock: (id, stock, isExist, stockIndex = -1) => {
        if (isExist) {
            sendQuery(
                `UPDATE users 
                 SET stocks[$2] = $3
                 WHERE id = $1;`,
                [id, stockIndex, stock]
            );
        } else {
            sendQuery(
                `UPDATE users 
                 SET stocks = array_append(stocks, $2)
                 WHERE id = $1;`,
                [id, stock]
            );
        }
    },

    DeleteUserStock: (id, stock) => {
        sendQuery(
            `UPDATE users 
             SET stocks = array_remove(stocks, stocks[$2])
             WHERE id = $1;`,
            [id, stock]
        );
    },

    CreateUserData: (id) => {
        sendQuery(
            `INSERT INTO users
             VALUES ($1, 100, ARRAY[]::text[]);`,
            [id]
        );
    }
};