const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo} = require("../StocksAPI");
const {InviteToGuild, GuildToStockCode, StockCodeToGuild} = require("../helpers");

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
            const stringInput = interaction.options.getString("server");

            let guild;
            let stockCode;
            let stockInfo;

            if (!stringInput.contains("/")) {
                if (stringInput.contains("$")) {
                    stockCode = stringInput;
                    stockInfo = GetStockInfo(stockCode);
                    guild = InviteToGuild(stockInfo.Invite);
                } else {
                    return interaction.reply("Sorry, you need to add `$` before your stock code");
                }
            } else {
                guild = InviteToGuild(stringInput.substring(stringInput.lastIndexOf("/") + 1));
                console.log(guild)
                stockCode = GuildToStockCode(guild);
                stockInfo = GetStockInfo(stockCode);
            }

            if (guild === "") {
                return interaction.reply("Sorry, specified server doesn't have StonksCord invited (Or your link was incorrect)");
            }

            if (stockInfo === {}) {
                return interaction.reply("Sorry, specified stock code was incorrect");
            }

            const stockEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for ${stockCode}`)
                .setThumbnail("https://via.placeholder.com/128")
                .setDescription(`[Click here for invite Link](${stockInfo.Invite})`)
                .addFields({
                    name: "Stonk Price",
                    value: stockInfo.Value,
                    inline: true
                }, {
                    name: "Market Cap",
                    value: stockInfo.MarketCap,
                    inline: true
                }, {
                    name: "Total stonks owned",
                    value: stockInfo.Stonks,
                    inline: true
                }, {
                    name: "Server",
                    value: `[${guild.name}](${stockInfo.Invite})`,
                    inline: true
                }, {
                    name: "Member Count",
                    value: stockInfo.MemberCount,
                    inline: true
                })
                .toJSON();

            return interaction.reply({embeds: [stockEmbed]});
        }
	},
};