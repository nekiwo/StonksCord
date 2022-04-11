const {GetStockData, UpdateStockData} = require("./db/db");
const {CalculatePrice} = require("./helpers");

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: async (code, IsInvite) => {
        return new Promise(resolve => {
            GetStockData(code, IsInvite).then(data => {
                if (data != undefined) {
                    let price = CalculatePrice(data.members.at(-1), data.total_shares.at(-1));
                    resolve({
                        ID: data.id,
                        GuildID: data.guild_id,
                        Cost: price.toString(),
                        MarketCap: (data.total_shares.at(-1) * price).toString(), // Probably unefficient with larger arrays (5k+ items)
                        TotalShares: data.total_shares.at(-1).toString(),
                        Invite: data.invite
                    });
                } else {
                    resolve({});
                }
            });
        });
    },

    UpdateStock: (code, members, shares) => {
        GetStockData(code, false).then(data => {
            // Check if 10 minutes have passed
            if (Date.now() - 600000 > Number(data.time_stamp.at(-1))) {
                UpdateStockData(code, members, shares);
            }
        });
    }
};