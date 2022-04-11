const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, UpdateStock} = require("../StocksAPI");
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
                if (stringInput[0] === "$") {
                    if (stringInput.length < 6) {
                        stockCode = stringInput.replace("$", "").toLowerCase();
                        stockInfo = await GetStockInfo(stockCode, false);
                        if (stockInfo === {}) {
                            return interaction.reply("Sorry, specified stock code was not found");
                        }
                    } else {
                        return interaction.reply("Sorry, specified stock code was too long (and wrong)");
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
            if (guild == undefined) {
                return interaction.reply("Sorry, specified stock code was not found");
            }

            let memberCount = guild.members.cache.filter(member => !member.user.bot).size;
            UpdateStock(stockCode, memberCount, stockInfo.TotalShares);
            
            const stockEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for $${stockCode.toUpperCase()}`)
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
                    value: memberCount.toString(),
                    inline: true
                })
                .toJSON();

            return interaction.reply({embeds: [stockEmbed]});
        }
	},
};