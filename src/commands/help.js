const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Not sure how to invest?"),
	async execute(interaction) {
        if (interaction) {
            const helpEmbed = new MessageEmbed()
            .setColor("#03fc5e")
            .setTitle("Welcome new StonksCord user!")
            .setThumbnail("https://i.ibb.co/nk9FGy1/icon-256.png")
            .setDescription("Earn imaginary coins through server investment! StonksCord allows you to invest in Discord servers. Each stock's price corresponds with a server's daily activity (and some other factors). Try to gain more coins by buying/selling your stonks!")
            .addFields({
                name: "\u200B",
                value: "\u200B",
                inline: true
            }, {
                name: "1. Start by finding a server",
                value: "Every stonk is represented by a server and identified by its stonk code or invite link. To check a certain stock info, simply use the `/stock` command, and paste the stonk code or server link\u000A"
            }, {
                name: "2. Buy/Sell stonks",
                value: "To buy or sell, simply use `/buy` and `/sell` commands respectively. First paste the server link (NOTE: needs this bot invited & 10 members minimum) and the amount of the stocks you want to buy. Each stock costs the specified price. Every user starts out with 100 coins\u000A"
            }, {
                name: "3. Watch the market",
                value: "In order to have big gains, you must watch the market. Access your portfolio by using the `/portfolio` command. Here you can see your balance and owned stonks. Use commands such as `/stock` and `/scoreboard` for stock info.\u000A"
            }, {
                name: "4. Check out our server",
                value: "Check out our investment hub server. Here you can talk about trading your favorite server stocks! Invite link: https://discord.gg/8BxJmu4HSu\u000A"
            }, {
                name: "\u200B",
                value: "\u200B",
                inline: true
            })
            .setFooter("Thanks to Foo#7957, nekiwo#7574, and others at HTSTEM for contributing to StonksCord's development")
            .toJSON();
        
            return interaction.reply({embeds: [helpEmbed]});
        }
	},
};