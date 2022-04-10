const {GetStockData} = require("./db/db");
const {CalculatePrice} = require("./helpers");

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: async (code, IsInvite = false) => {
        return new Promise(resolve => {
            GetStockData(code, IsInvite).then(data => {
                console.log("GetStockInfo", data)
                if (data != undefined) {
                    let price = CalculatePrice(data.members.at(-1), data.total_shares.at(-1));
                    resolve({
                        ID: data.id,
                        GuildID: data.guild_id,
                        Cost: price.toString(),
                        MarketCap: (data.total_shares.at(-1) * price).toString(),
                        TotalShares: data.total_shares.at(-1).toString(),
                        Invite: data.invite
                    });
                } else {
                    resolve({});
                }
            });
        });
    },

    UpdateStock: (code) => {
        
    }
};