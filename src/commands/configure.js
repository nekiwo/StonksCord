const {MessageEmbed} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetUserInfo, CreateUser} = require("../StocksAPI");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("configure")
		.setDescription("Configure your server as a stock")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code for your server")),
	async execute(interaction) {
        if (interaction) {
            const code = interaction.options.getString("code");

            if (interaction.user.hasPermission("ADMINISTRATOR")) {
                if (code !== undefined) {
                    if (1 < code.length && code.length < 5) {
                        // check for existance
                    } else {
                        return interaction.reply("Sorry, the code needs to contain 2-4 latin characters");
                    }
                } else {
                    return interaction.reply("");
                }
            } else {
                return interaction.reply("Sorry, you need administrator privileges to configure this server");
            }
            
            return interaction.reply({embeds: [userEmbed.toJSON()]});
        }
	},
};