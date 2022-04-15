const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetUserInfo} = require("../StocksAPI");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("portfolio")
		.setDescription("Check your balance and stocks"),
	async execute(interaction) {
        if (interaction) {
            let userInfo = await GetUserInfo(interaction.user.id);

            let userEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`User info for @${interaction.user.username}`)
                .addFields({
                    name: "Balance",
                    value: userInfo.Balance.toString(),
                    inline: true
                }, {
                    name: "Worth",
                    value: stockInfo.MarketCap.toString(),
                    inline: true
                }, {
                    name: "List of Stocks",
                    value: "$TEST - 23 shares (4354$)\n$TEST - 23 shares (4354$)"
                });
            
            return interaction.reply({embeds: [userEmbed.toJSON()]});
        }
	},
};