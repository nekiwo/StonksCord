const path = require("path");
const {MessageEmbed} = require("discord.js") ;
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetTopStocksList, GetTopUsersList} = require(path.join(__dirname, "..", "StocksAPI"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName("scoreboard")
		.setDescription("Top best/worst performing stocks and users")
        .addStringOption(option => option
            .setName("scoreboard")
            .setDescription("Which scoreboard")
            .setRequired(true)
            .addChoice("Best Stocks", "BestStocks")
            .addChoice("Worst Stocks", "WorstStocks")
            .addChoice("Richest Users", "RichestUsers")
        ),
	async execute(interaction, client) {
        if (interaction) {
            const scoreboardType = interaction.options.getString("scoreboard");

            let finalEmbed;

            let placeFormat;
            let itemsLength;

            const chartEmoji = value => value > 0 ? "📈" : "📉";

			switch (scoreboardType) {
				case "BestStocks":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 best performing stonks");

                    const bestStocks = await GetTopStocksList(false);

                    itemsLength = bestStocks.length;
                    placeFormat = (i) => {
                        finalEmbed.addField(`#${i} $${bestStocks[i - 1].Code.toUpperCase()}`,
                            `Change over 7 days: ${bestStocks[i - 1].Change}$ ${chartEmoji(bestStocks[i - 1].Change)}`,
                            false
                        );
                    }
					break;
				case "WorstStocks":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 worst performing stonks");

                    const worstStocks = await GetTopStocksList(true);

                    itemsLength = worstStocks.length;
                    placeFormat = (i) => {
                        finalEmbed.addField(
                            `#${i} $${worstStocks[i - 1].Code.toUpperCase()}`,
                            `Change over 7 days: ${worstStocks[i - 1].Change}$ ${chartEmoji(worstStocks[i - 1].Change)}`,
                            false
                        );
                    }
					break;
				case "RichestUsers":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 richest users");

                    const richestUsers = await GetTopUsersList(client);

                    itemsLength = richestUsers.length;
                    placeFormat = (i) => {
                        finalEmbed.addField(`#${i} ${richestUsers[i - 1].Tag}`, `Total asset worth: ${richestUsers[i - 1].Worth}$`, false);
                    }
					break;
			}

            for (let i = 1; i <= itemsLength; i++) {
                placeFormat(i);
            }

            return interaction.reply({embeds: [finalEmbed.toJSON()]});
        }
	}
};