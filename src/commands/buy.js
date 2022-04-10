const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo} = require("../StocksAPI");
const {FindGuild} = require("../helpers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("buy")
		.setDescription("Buy a stock")
        .addStringOption(option => 
                option.setName("code")
                    .setDescription("Stock code or server link")
                    .setRequired(true)
        )
        .addIntegerOption(option => 
            option
            .setName('amount')
            .setDescription('The amount of stock to buy (defaults to 1)')
        ),
	async execute(interaction) {
        if (interaction) {
            const stringInput = interaction.options.getString("code");
            let amount;
            if(interaction.options.getString("amount") == "") {
                amount = 1;
            }
            else {
                amount = interaction.options.getString("amount");
            }

            let guild;
            let stockCode;
            let stockInfo;

            if (!stringInput.includes("/")) {
                if (stringInput[0] === "$") {
                    if (stringInput.length < 6) {
                        stockCode = stringInput.replace("$", "").toLowerCase();
                        stockInfo = await GetStockInfo(stockCode);
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

            // todo, actually interact with database
            // check if user has enough money
            // else, 
            // return interaction.reply("You do not have enough money to buy ${amount} of these stocks!");
            // check other stuff that needs to be checked for them to be able to buy a stock
            // buy the stock
            
            const replyEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for $${stockCode.toUpperCase()}`)
                .setThumbnail(guild.iconURL())
                .setDescription(`You bought ${amount} stocks in $${stockCode.toUpperCase()}`)
                .setFooter({ text: "(No you didn't, the command doesn't actually work yet)" })
                .toJSON();

            return interaction.reply({embeds: [replyEmbed]});
        }
	},
};