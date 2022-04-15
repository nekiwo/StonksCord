const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sell")
		.setDescription("Sell a stock"),
	async execute(interaction) {
        if (interaction) {
            
        }
	},
};