const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, UpdateStockInfo, GetUserInfo, UpdateUserInfo} = require("../StocksAPI");
const {FindGuild, RoundPlaces} = require("../helpers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sell")
		.setDescription("Sell a stock")
        .addStringOption(option => option
            .setName("code")
            .setDescription("Stock code or server link")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("The amount of stock to sell (defaults to 1)")
        ),
	async execute(interaction, client) {
        if (interaction) {
            const code = interaction.options.getString("code");
            
            let amount = interaction.options.getInteger("amount");
            if (amount == null) {
                amount = 1;
            }

            let guild;
            let stockCode;
            let stockInfo;

            if (!code.includes("/")) {
                if (code[0] === "$") {
                    if (code.length < 6) {
                        stockCode = code.replace("$", "").toLowerCase();
                        stockInfo = await GetStockInfo(stockCode, "id");
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
                stockInfo = await GetStockInfo(code.substring(code.lastIndexOf("/") + 1), "invite");
                if (stockInfo === {}) {
                    return interaction.reply("Sorry, specified server doesn't have StonksCord invited (or your link was incorrect)");
                }
                stockCode = stockInfo.ID;
            }

            guild = FindGuild(stockInfo.GuildID, client);
            if (guild == undefined) {
                return interaction.reply("Sorry, specified stock code was not found");
            }

            let userInfo = await GetUserInfo(interaction.user.id);
            if (userInfo == 0) {
                return interaction.reply("Check your portfolio before making your first sell");
            }

            let ownedStock = userInfo.Stocks.filter(s => s.id === stockCode);
            let sharesOwned = 0;

            if (ownedStock[0] != undefined) {
                sharesOwned = ownedStock[0].shares;
            }



            if (sharesOwned < amount) {
                return interaction.reply(
                    `You can't sell ${amount} shares (You only have ${sharesOwned})`
                );
            } else if (sharesOwned === amount) {
                UpdateUserInfo(
                    userInfo.ID,
                    userInfo.Balance + (stockInfo.Price * amount),
                    {
                        "id": stockCode,
                        "shares": sharesOwned,
                        "delete": true
                    }
                );
            } else {
                UpdateUserInfo(
                    userInfo.ID,
                    userInfo.Balance + (stockInfo.Price * amount),
                    {
                        "id": stockCode,
                        "shares": sharesOwned - amount,
                        "delete": false
                    }
                );
            }

            UpdateStockInfo(stockCode, TotalMembers(stockInfo.Invite), stockInfo.TotalShares - amount);
            
            const sellEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`You sold ${amount} shares in $${stockCode.toUpperCase()}`)
                .setThumbnail(guild.iconURL())
                .setDescription(`You earned ${RoundPlaces(stockInfo.Price) * amount}$ and your current balance is ${RoundPlaces(userInfo.Balance + (stockInfo.Price * amount))}$`);

            return interaction.reply({embeds: [sellEmbed.toJSON()]});
        }
	},
};