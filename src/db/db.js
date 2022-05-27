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
                `SELECT id, guild_id, invite, members[array_upper(members, 1)], price[array_upper(price, 1)], total_shares[array_upper(total_shares, 1)] FROM stocks WHERE ${column} = $1;`, 
                [value]
            ).then(data => {
                resolve(data[0]);
            });
        });
    },

    GetStockMembersData: (code) => {
        return new Promise(resolve => {
            sendQuery(
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

    GetTopStocksData: (desc) => {
        return new Promise(resolve => {
            sendQuery(// format this later xd
                `SELECT * FROM (SELECT id, (SELECT p
                 FROM (SELECT unnest(price) p, unnest(time_stamps) t FROM stocks) AS test1
                 ORDER BY abs(extract(epoch FROM (t - (NOW()::timestamp without time zone - INTERVAL '168 hours'))))
                 limit 1) AS old_price, (SELECT price[array_upper(price, 1)] FROM stocks) AS current_price FROM stocks) AS test3 ORDER BY current_price - old_price ${desc} LIMIT 10`
            ).then(data => {
                resolve(data);
            });
        });
    },

    GetAllStocksData: () => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM stocks`
            ).then(data => {
                resolve(data);
            });
        });
    },

    GetAllStockMembersData: (code) => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM stock${code}`
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

    DeleteStockMembersData: (code) => {
        sendQuery(
            `WITH corrected AS (
                SELECT id, array_agg(ts) new_time_stamps
                FROM stock${code}, unnest(time_stamps) ts
                WHERE NOW()::timestamp without time zone - ts < interval '24 hours'
                GROUP BY id
            )
            UPDATE stock${code}
            SET time_stamps = new_time_stamps
            FROM corrected
            WHERE time_stamps <> new_time_stamps
            AND stock${code}.id = corrected.id;`
        );

        sendQuery(
            ``// delete rows that have zero "time_stamps" entries over past 24 hours
        );
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

    GetTopUsersData: () => {
        return new Promise(resolve => {
            sendQuery(
                `SELECT * FROM users ORDER BY worth LIMIT 10;`
            ).then(data => {
                resolve(data);
            });
        });
    },

    UpdateUserBalance: (id, balance, worth) => {
        sendQuery(
            `UPDATE users
             SET balance = $2
             SET worth = $3
             WHERE id = $1;`,
            [id, balance, worth]
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
             VALUES ($1, 100, ARRAY[]::text[], 100);`,
            [id]
        );
    }
};