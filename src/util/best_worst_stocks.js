const path = require("path");
const {GetTopStocksList} = require(path.join(__dirname, "stocks_api"));
const {MessageEmbed} = require("discord.js") ;

module.exports = {
    BestWorstEmbeds: () => {

        let bestStocksEmbed = new MessageEmbed() // taken from scoreboard command
        .setColor("#03fc5e")
        .setTitle("Top 10 best performing stonks");

        const bestStocks = GetTopStocksList(false);

        for (let i = 1; i <= bestStocks.length; i++) {
            bestStocksEmbed.addField(
                `#${i} $${bestStocks[i - 1].Code.toUpperCase()}`,
                `Change over 7 days: ${bestStocks[i - 1].Change}$ ${chartEmoji(bestStocks[i - 1].Change)}`,
                false
            );
        }

        let worstStocksEmbed = new MessageEmbed() // taken from scoreboard command
            .setColor("#03fc5e")
            .setTitle("Top 10 worst performing stonks");

        const worstStocks = GetTopStocksList(true);

        for (let i = 1; i <= worstStocks.length; i++) {
            worstStocksEmbed.addField(
                `#${i} $${worstStocks[i - 1].Code.toUpperCase()}`,
                `Change over 7 days: ${worstStocks[i - 1].Change}$ ${chartEmoji(worstStocks[i - 1].Change)}`,
                false
            );
        }

        return [bestStocksEmbed, worstStocksEmbed];
    }
}