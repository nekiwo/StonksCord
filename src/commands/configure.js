const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, CreateStockInfo} = require("../StocksAPI");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("configure")
		.setDescription("Configure your server as a stock")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code for your server")),
	async execute(interaction, client) {
        if (interaction) {
            const code = interaction.options.getString("code");

            if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                if (code != null) {
                    if (1 < code.length && code.length < 5 && /^[a-z]+$/i.test(code)) {
                        let stock = await GetStockInfo(code, false);
                        if (JSON.stringify(stock) == "{}") {
                            let configEmbed = new MessageEmbed()
                                .setColor("#03fc5e")
                                .setTitle(`Are you sure you want to use $${code.toUpperCase()} as an identification code for this server?`)
                                .addFields({
                                    name: "This code is used by everyone else to identify your server",
                                    value: `When someone tries to buy or sell this server's stonk, they will be using "$${code.toUpperCase()}" to identify it`
                                }, {
                                    name: "You will not be able to change it later",
                                    value: "This code is used to identity your stonk in the database, and can only be changed manually by the developers"
                                }, {
                                    name: "If you need to change or delete your server from the stonk market",
                                    value: "Please contatct the developers: `nekiwo#7574` or `Foo#7957`"
                                }, {
                                    name: "Please proceed by clicking the \"Accept\" button below",
                                    value: "Otherwise, you may press the \"Cancel\" button"
                                });

                            const configBtns = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId(JSON.stringify({
                                            "func": "accept",
                                            "stock": code
                                        }))
                                        .setLabel("Accept")
                                        .setStyle("SUCCESS"),
                                    new MessageButton()
                                        .setCustomId(JSON.stringify({
                                            "func": "cancel",
                                            "stock": code
                                        }))
                                        .setLabel("Cancel")
                                        .setStyle("DANGER")
                                );

                            client.on("interactionCreate", async i => {
                                if (!i.isButton()) return;
                    
                                if (i.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                    const data = JSON.parse(i.customId);
                                    
                                    switch (data.func) {
                                        case "accept":
                                            CreateStockInfo(code.toLowerCase(), i.guild, i.channel);
    
                                            configEmbed = new MessageEmbed()
                                                .setColor("#03fc5e")
                                                .setTitle(`Code set as $${code.toUpperCase()}`);
                                            return i.update({embeds: [configEmbed.toJSON()], components: []});
                                            break;
                                        case "cancel":
                                            console.log("delete reply")
                                            return i.deleteReply();
                                            break;
                                    }
                                } else {
                                    console.log("no admin")
                                }
                            });

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
                return interaction.reply("Sorry, you need administrator privileges to configure this server as a stonk");
            }
            
            return interaction.reply({embeds: [userEmbed.toJSON()]});
        }
	},
};