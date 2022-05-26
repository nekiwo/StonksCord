const {SlashCommandBuilder} = require("@discordjs/builders");

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
	async execute(interaction) {
        if (interaction) {
            const scoreboardType = interaction.options.getString("scoreboard");

            let finalEmbed;
            let placeFormat;
			switch (scoreboardType) {
				case "BestStocks":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 best performing stonks");

                    placeFormat = (i) => {
                        finalEmbed.addField(`#${i} $${bestStocks[i - 1].Code.toUpperCase()} - ${bestStocks[i - 1].Change}% 📈`, "", false);
                    }
					break;
				case "WorstStocks":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 worst performing stonks");

                    placeFormat = (i) => {
                        finalEmbed.addField(`#${i} $${worstStocks[i - 1].Code.toUpperCase()} - ${worstStocks[i - 1].Change}% 📉`, "", false);
                    }
					break;
				case "RichestUsers":
					finalEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Top 10 richest users");

                    placeFormat = (i) => {
                        finalEmbed.addField(`#${i} $${richestUsers[i - 1].Tag} - ${richestUsers[i - 1].Worth}$`, "", false);
                    }
					break;
			}

            for (let i = 1; i <= 10; i++) {
                placeFormat(i);
            }
        }
	}
};