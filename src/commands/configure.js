const path = require("path");
const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo} = require(path.join(__dirname, "..", "StocksAPI"));
const {ReviewStockInfo} = require(path.join(__dirname, "..", "helpers"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName("configure")
		.setDescription("Configure your server as a stock")
        .addStringOption(option => option
            .setName("code")
            .setDescription("Stock code for your server")),
	async execute(interaction, client) {
        if (interaction) {
            const code = interaction.options.getString("code");

            if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                let guildStock = await GetStockInfo(interaction.guild.id, "guild_id");
                
                if (JSON.stringify(guildStock) == "{}") {
                    if (code != null) {
                        if (1 < code.length && code.length < 5 && /^[a-z]+$/i.test(code)) {
                            let codeStock = await GetStockInfo(code, "id");

                            if (JSON.stringify(codeStock) == "{}") {
                                let configEmbed = new MessageEmbed()
                                    .setColor("#03fc5e")
                                    .setTitle(`Are you sure you want to use $${code.toUpperCase()} as an identification code for this server?`)
                                    .addFields({
                                        name: "This code is used by everyone else to identify your server",
                                        value: `When someone tries to buy or sell this server's stonk, they will be using "$${code.toUpperCase()}" to identify it`
                                    }, {
                                        name: "Your server will be publically exposed to all users of StonksCord",
                                        value: "Your code, invite link, server ID, and icon will be stored and shared publically"
                                    }, {
                                        name: "You will not be able to change it later",
                                        value: "This code is used to identity your stonk in the database, and can only be changed manually by the developers"
                                    }, {
                                        name: "If you need to change or delete your server from the stonk market",
                                        value: "Please contatct the developers: `nekiwo#7574` or `Foo#7957`"
                                    }, {
                                        name: "I consent to the terms above by clicking the \"Accept\" button",
                                        value: "I do not consent to the terms above by clicking the \"Cancel\" button"
                                    });
    
                                const configBtns = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId(JSON.stringify({
                                                "func": "accept",
                                                "code": code
                                            }))
                                            .setLabel("Accept")
                                            .setStyle("SUCCESS"),
                                        new MessageButton()
                                            .setCustomId(JSON.stringify({
                                                "func": "cancel",
                                                "code": code
                                            }))
                                            .setLabel("Cancel")
                                            .setStyle("DANGER")
                                    );
    
                                return interaction.reply({embeds: [configEmbed.toJSON()], components: [configBtns]});
                            } else {
                                return interaction.reply("Sorry, this code already exists");
                            }
                        } else {
                            return interaction.reply("Sorry, the code needs to contain 2-4 Latin characters");
                        }
                    } else {
                        return interaction.reply("You need to enter a 2-4 letter code you wish to use for indetification of your server in the stonk market");
                    }
                } else {
                    return interaction.reply("Sorry, you already configured this server");
                }
            } else {
                return interaction.reply("Sorry, you need administrator privileges to configure this server as a stonk");
            }
        }
	},
};