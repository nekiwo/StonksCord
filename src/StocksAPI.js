const {GetStockData} = require("./db/db");

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: async (code, IsInvite = false) => {
        return new Promise(resolve => {
            GetStockData(code, IsInvite).then(data => {
                console.log("GetStockInfo", data)
                if (data != undefined) {
                    resolve({
                        ID: data.id,
                        GuildID: data.guild_id,
                        Cost: data.price[data.price.length - 1].toString(),
                        MarketCap: data.price[data.market_cap.length - 1].toString(),
                        TotalShares: data.price[data.total_shares.length - 1].toString(),
                        Invite: data.invite
                    });
                } else {
                    resolve({});
                }
            });
        });
    }
};