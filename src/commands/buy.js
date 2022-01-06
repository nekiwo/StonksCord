const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("buy")
		.setDescription("Buy stocks of a startup")
        .addStringOption(option =>
            option.setName("server")
                .setDescription("Server you want to invest in")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Amount you want to buy")
                .setRequired(true)),
	async execute(interaction) {
        if (interaction) {
            return interaction.reply(interaction.options.getString("server") + ", " + (interaction.options.getInteger("amount") + 1).toString());
        }
	},
};