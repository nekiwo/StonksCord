const {GetStockData} = require("./db/db");

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: async (code) => {
        let data = await GetStockData(code);

        return {
            Cost: "111",
            MarketCap: "222",
            TotalShares: "333",
            Invite: "inite"
        }
    }
};