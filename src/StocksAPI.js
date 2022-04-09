const {GetStockData} = require("./db/db");

module.exports = {
    GuildToStockCode: (code) => {
        
    },

	GetStockInfo: async (code, IsInvite = false) => {
        let data = await GetStockData(code, IsInvite);

        if (data !== {}) {
            return {
                ID: data.id,
                GuildID: data.guild_id,
                Cost: data.price[data.price.length - 1],
                MarketCap: data.price[data.market_cap.length - 1],
                TotalShares: data.price[data.total_shares.length - 1],
                Invite: data.invite
            };
        } else {
            return {};
        }
    }
};