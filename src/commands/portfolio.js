const {MessageEmbed, MessageActionRow, MessageButton, MessageAttachment} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("portfolio")
		.setDescription("Check your balance and stocks")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code or server link")
                .setRequired(true)),
	async execute(interaction) {
        if (interaction) {
            
        }
	},
};