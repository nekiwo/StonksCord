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

			switch (scoreboardType) {
				case "BestStocks":
					
					break;
				case "WorstStocks":
					
					break;
				case "RichestUsers":
					
					break;
			}
        }
	}
};