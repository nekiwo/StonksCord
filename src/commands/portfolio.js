const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetUserInfo, CreateUserInfo} = require("../StocksAPI");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("portfolio")
		.setDescription("Check your balance and stocks"),
	async execute(interaction) {
        if (interaction) {
            let userInfo = await GetUserInfo(interaction.user.id);
            let userEmbed;

            if (userInfo != 0) {
                let stockListString = "NONE";
                console.log("portfolio", userInfo.Stocks)
                if (userInfo.Stocks.length > 0) {
                    console.log(userInfo.Stocks)
                    userInfo.Stocks.forEach(stock => {
                        stockListString = stockListString + `$${stock.id} - ${stock.shares} shares (${stock.worth}$)\n`;
                    });
                }

                userEmbed = new MessageEmbed()
                    .setColor("#03fc5e")
                    .setTitle(`User info for @${interaction.user.username}`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields({
                        name: "Balance",
                        value: userInfo.Balance.toString() + "$",
                        inline: true
                    }, {
                        name: "Worth",
                        value: userInfo.Worth.toString() + "$",
                        inline: true
                    }, {
                        name: "List of Stocks",
                        value: stockListString
                    });
            } else {
                CreateUserInfo(interaction.user.id);

                userEmbed = new MessageEmbed()
                    .setColor("#03fc5e")
                    .setTitle(`User info for @${interaction.user.username}`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields({
                        name: "Balance",
                        value: "100$",
                        inline: true
                    }, {
                        name: "Worth",
                        value: "100$",
                        inline: true
                    }, {
                        name: "List of Stocks",
                        value: "NONE"
                    });
            }
            
            return interaction.reply({embeds: [userEmbed.toJSON()]});
        }
	},
}