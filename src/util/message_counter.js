const path = require("path");
const {GetStockInfo, UpdateStockMembers} = require(path.join(__dirname, "stocks_api"));

module.exports = {
    MessageCounter: async (guildId, userId) => {
        let stock = await GetStockInfo(guildId, "guild_id");
        if (JSON.stringify(stock) != "{}") {
            UpdateStockMembers(stock.ID, userId);
        }
    }
}