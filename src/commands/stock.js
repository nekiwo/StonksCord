const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo} = require("../StocksAPI");
const {FindGuild} = require("../helpers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stock")
		.setDescription("Info for a specific stock")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code or server link")
                .setRequired(true)),
	async execute(interaction) {
        if (interaction) {
            const stringInput = interaction.options.getString("code");

            let guild;
            let stockCode;
            let stockInfo;

            if (!stringInput.includes("/")) {
                if (stringInput.includes("$")) {
                    stockCode = stringInput.replace("$", "").toUpperCase();
                    stockInfo = await GetStockInfo(stockCode);
                    if (stockInfo === {}) {
                        return interaction.reply("Sorry, specified stock code was incorrect");
                    }
                } else {
                    return interaction.reply("Sorry, you need to add `$` before your stock code");
                }
            } else {
                stockInfo = await GetStockInfo(stringInput.substring(stringInput.lastIndexOf("/") + 1), true);
                if (stockInfo === {}) {
                    return interaction.reply("Sorry, specified server doesn't have StonksCord invited (Or your link was incorrect)");
                }
                stockCode = stockInfo.ID;
            }

            guild = FindGuild(stockInfo.GuildID);
            if (guild === {}) {
                return interaction.reply("Sorry, specified server or stock was deleted");
            }
            
            const stockEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for $${stockCode}`)
                .setThumbnail(guild.iconURL())
                //.setDescription(`[Click here for invite Link](${stockInfo.Invite})`)
                .addFields({
                    name: "Stonk Price",
                    value: stockInfo.Cost,
                    inline: true
                }, {
                    name: "Market Cap",
                    value: stockInfo.MarketCap,
                    inline: true
                }, {
                    name: "Total Shares",
                    value: stockInfo.TotalShares,
                    inline: true
                }, {
                    name: "Server",
                    value: `[${guild.name}](${stockInfo.Invite})`,
                    inline: true
                }, {
                    name: "Member Count",
                    value: guild.members.cache.filter(member => !member.user.bot).size.toString(),
                    inline: true
                })
                .toJSON();

            return interaction.reply({embeds: [stockEmbed]});
        }
	},
};