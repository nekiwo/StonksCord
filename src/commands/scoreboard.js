const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("scoreboard")
		.setDescription("Top best/worst performing stocks and users")
        .addStringOption(option => option
            .setName("scoreboard")
            .setDescription("Which scoreboard (stocks, stocksworst, users)")
            .setRequired(true)
        ),
	async execute(interaction) {
        if (interaction) {
            const scoreboardType = interaction.options.getString("scoreboard");

			switch (scoreboardType) {
				case "stocks":
					
					break;
				case "stocksworst":
					
					break;
				case "users":
					
					break;
				default:
					return interaction.reply("Scoreboard type not found in list (stocks, stocksworst, users)");
					break;
			}
        }
	}
};