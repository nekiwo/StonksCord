const fs = require("fs");
const {Pool} = require("pg");

const config = JSON.parse(fs.readFileSync("./config.json"));
const pool = new Pool(config.DBConfig.db);


const SendQuery = async (query, params) => {
    const {rows, fields} = await pool.query(query, params);
    
    if (rows != null) {
        return rows;
    }

    return [];
}


module.exports = {
    GetStockData: async (code) => {
        const data = SendQuery(
            "SELECT * FROM stock WHERE id=$1;", 
            [code]
        );

        if (data === []) {
            
        }

        console.log(data);

        return data;
    }
};