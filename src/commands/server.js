const path = require("path");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {InviteToGuild} = require(path.join(__dirname, "..", "helpers"));

// just a testing/debug command

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Test command")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code or server link")
                .setRequired(true)),
	async execute(interaction, client) {
        if (interaction) {
            const stringInput = interaction.options.getString("code");

            let guild;
            guild = InviteToGuild(stringInput.substring(stringInput.lastIndexOf("/") + 1), client);

            const embed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(guild.name)
                .setThumbnail("https://via.placeholder.com/128")
                .setDescription(`a`)
                .toJSON();

            return interaction.reply({embeds: [embed]});
        }
	},
};