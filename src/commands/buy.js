const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    test: "bruh",
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy stocks of a startup')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('Server you want to invest in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Amount you want to buy')
                .setRequired(true)),
	async execute(interaction) {
		return interaction.reply(interaction.options.getString('server') + ", " + (interaction.options.getInteger('amount') + 1).toString());
	},
};