const {Client} = require("pg");
const client = new Client();
await client.connect();

const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: (code) => {
        
        let memberCount = 10; // todo, be the actual member count
        if(memberCount < 10) {
            return false;
        }
        else {
            let totalShares = 10; // todo be real

            let sharePrice = memberCount + (totalStocksOwned * 0.1);
        }
    }
};