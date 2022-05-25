const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("scoreboard")
		.setDescription("Top best/worst performing stocks and users"),
	async execute(interaction, client) {
        if (interaction) {


            let bestStocksEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle("Top 10 best performing stonks");

            let worstStocksEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle("Top 10 worst performing stonks");

            let richestUsersEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle("Top 10 richest users");

            for (let i = 1; i <= 10; i++) {
                bestStocksEmbed.addField(`#${i} $${bestStocks[i - 1].Code.toUpperCase()} - ${worstStocks[i - 1].Change}% 📈`, "", false);
                worstStocksEmbed.addField(`#${i} $${worstStocks[i - 1].Code.toUpperCase()} - ${worstStocks[i - 1].Change}% 📉`, "", false);
                richestUsersEmbed.addField(`#${i} $${richestUsers[i - 1].Tag} - ${richestUsers[i - 1].Worth}$`, "", false);
            }

            const listBtn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(JSON.stringify({
                            "func": "BestStocks"
                        }))
                        .setLabel("Best Stocks")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId(JSON.stringify({
                            "func": "WorstStocks"
                        }))
                        .setLabel("Worst Stocks")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId(JSON.stringify({
                            "func": "RichestUsers"
                        }))
                        .setLabel("Richest Users")
                        .setStyle("PRIMARY")
                );

            return interaction.reply({embeds: [bestStocksEmbed.toJSON()], components: [listBtn]});
        }
	},

    Embeds: []
};