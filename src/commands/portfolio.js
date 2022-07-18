const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetUserInfo, CreateUserInfo} = require(path.join(__dirname, "..", "StocksAPI"));
const {RoundPlaces} = require(path.join(__dirname, "..", "helpers"));

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
                if (userInfo.Stocks.length > 0) {
                    stockListString = "";
                    userInfo.Stocks.forEach(stock => {
                        stockListString = stockListString + `$${stock.id.toUpperCase()} - ${stock.shares} shares (${RoundPlaces(stock.worth)}$)\n`;
                    });
                }

                userEmbed = new MessageEmbed()
                    .setColor("#03fc5e")
                    .setTitle(`@${interaction.user.username}'s portfolio`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields({
                        name: "Balance",
                        value: RoundPlaces(userInfo.Balance).toString() + "$",
                        inline: true
                    }, {
                        name: "Worth",
                        value: RoundPlaces(userInfo.Worth).toString() + "$",
                        inline: true
                    }, {
                        name: "List of Stocks",
                        value: stockListString
                    });
            } else {
                CreateUserInfo(interaction.user.id);

                userEmbed = new MessageEmbed()
                    .setColor("#03fc5e")
                    .setTitle(`@${interaction.user.username}'s portfolio`)
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