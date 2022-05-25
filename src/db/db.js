const fs = require("fs");
const {Pool, types} = require("pg");

const config = JSON.parse(fs.readFileSync("./config.json"));
const pool = new Pool(config.DBConfig.db);

types.setTypeParser(1700, value => parseFloat(value));


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

    GetStockMembersData: (code) => {
        return new Promise(resolve => {
            sendQuery(
                //`SELECT * FROM stock${code};`
                `SELECT cardinality(array_agg(msg)) FROM  (
                    SELECT * FROM
                    (SELECT id, unnest(time_stamps) msg FROM stock${code}) AS test1
                    WHERE NOW() - msg < interval '24 hour'
                 ) AS test2
                 GROUP BY id;`
            ).then(data => {
                resolve(data);
            });
        });
    },

    GetStockDataOverTime: (code, days, column) => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM
                    (SELECT unnest(${column}) y, unnest(time_stamps) x FROM stocks WHERE id = $1) AS test1
                 WHERE NOW() - x < interval '${24 * days} hour'`, 
                [code]
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

    UpdateStockMembersData: (code, userId) => {
        sendQuery(
            `SELECT * FROM stock${code} WHERE id = $1;`, 
            [userId]
        ).then(data => {
            if (data.length === 0) {
                sendQuery(
                    `INSERT INTO stock${code}
                     VALUES ($1, ARRAY [NOW()::timestamp without time zone]::timestamp without time zone[]);`, 
                    [userId]
                );
            } else {
                sendQuery(
                    `UPDATE stock${code} 
                     SET time_stamps = array_append(time_stamps, NOW()::timestamp without time zone)
                     WHERE id = $1;`,
                    [userId]
                );
            }
        });
    },

    CreateStockData: (code, guildId, invite, members) => {
        sendQuery(
            `INSERT INTO stocks
             VALUES ($1, $2, $3, ARRAY [$4::integer]::integer[], ARRAY [0]::integer[], ARRAY [0]::integer[], ARRAY [NOW()::timestamp without time zone]::timestamp without time zone[]);`, 
            [code, guildId, invite, members]
        );
    },

    CreateStockMembersData: (code) => {
        sendQuery(
            `CREATE TABLE stock${code} (
                 id text PRIMARY KEY UNIQUE,
                 time_stamps timestamp without time zone[]
             );`
        );
    },

    GetUserData: (id) => {
        return new Promise(resolve => {
            sendQuery(
                "SELECT * FROM users WHERE id = $1;", 
                [id.toString()]
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