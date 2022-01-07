const {SlashCommandBuilder} = require("@discordjs/builders");

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
            const amount = interaction.options.getInteger("amount");
            const serverLink = interaction.options.getString("server");
            const invite = serverLink.substring(serverLink.lastIndexOf("/") + 1);

            client.guilds.cache.forEach(guild => {
                guild.fetchInvites().then(invites => { 
                    invites.forEach(invite => {
                        if (invite.code == invite) {
                            // guild found
                            return interaction.reply();
                        }
                    })
                })
            });

            return interaction.reply("Sorry, specified server doesn't have me invited (Or your link was incorrect)");
        }
	},
};