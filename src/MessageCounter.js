const {GetStockInfo, UpdateStockMembers} = require("./StocksAPI");

module.exports = {
    MessageCounter: async (guildId, userId) => {
        let stock = await GetStockInfo(guildId, "guild_id");
        if (JSON.stringify(stock) != "{}") {
            UpdateStockMembers(stock.ID, userId);
        }
    }
}