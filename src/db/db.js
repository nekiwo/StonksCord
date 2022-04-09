const fs = require("fs");
const {Pool} = require("pg");

const config = JSON.parse(fs.readFileSync("./config.json"));
const pool = new Pool(config.DBConfig.db);


const SendQuery = async (query, params) => {
    const {rows, fields} = await pool.query(query, params);
    
    if (rows != null) {
        return rows;
    }
    
    console.log("SendQuery", rows, fields)

    return {};
}


module.exports = {
    GetStockData: async (code, IsInvite) => {
        let data;

        if (!IsInvite) {
            data = await SendQuery(
                "SELECT * FROM stock WHERE id='$1';", 
                [code]
            );
            console.log("GetStockData T", data);
        } else {
            data = SendQuery(
                "SELECT * FROM stock WHERE invite='$1';", 
                [code]
            );
            console.log("GetStockData F", data);
        }

        return data;
    }
};