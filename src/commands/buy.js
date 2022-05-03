const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, UpdateStockInfo, GetUserInfo, UpdateUserInfo} = require("../StocksAPI");
const {FindGuild} = require("../helpers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("buy")
		.setDescription("Buy a stock")
        .addStringOption(option => option
            .setName("code")
            .setDescription("Stock code or server link")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("The amount of stock to buy (defaults to 1)")
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
                return interaction.reply("Check your portfolio before making your first buy");
            }

            if (userInfo.Balance <= amount * stockInfo.Price + 1) {
                return interaction.reply(
                    `You do not have enough money to buy ${amount} shares of $${stockCode.toUpperCase()}\n
                     You have: ${userInfo.Balance}\n
                     It costs: ${amount * stockInfo.Price + 1}\n
                     You need: ${amount * stockInfo.Price + 1 - userInfo.Balance} more`
                );
            } else {
                let ownedStock = userInfo.Stocks.filter(s => s.id === stockCode);
                let sharesOwned = 0;

                console.log("#4", ownedStock, ownedStock[0] != undefined)
                if (ownedStock[0] != undefined) {
                    sharesOwned = ownedStock[0].shares;
                }

                UpdateUserInfo(
                    userInfo.ID,
                    userInfo.Balance - (amount * stockInfo.Price + 1),
                    {
                        "id": stockCode,
                        "shares": sharesOwned + amount,
                        "delete": false
                    }
                );

                UpdateStockInfo(stockCode, guild.members.cache.filter(member => !member.user.bot).size, stockInfo.TotalShares + amount)
            }
            
            const buyEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`You bought ${amount} shares in $${stockCode.toUpperCase()}`)
                .setThumbnail(guild.iconURL())
                .setDescription(`You spent ${amount * stockInfo.Price}$ (+1$ transaction fee) and your current balance is ${userInfo.Balance - (amount * stockInfo.Price + 1)}$`);

            return interaction.reply({embeds: [buyEmbed.toJSON()]});
        }
	},
};