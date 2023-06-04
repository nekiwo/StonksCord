const fs = require("fs");
const path = require("path");
const {MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, Permissions} = require("discord.js") 
const {GetStockOverTime, CreateStockInfo} = require(path.join(__dirname, "stocks_api"));
const {ReviewStockInfo} = require(path.join(__dirname, "helpers"));
const {RenderChart} = require(path.join(__dirname, "render_chart"));

let GetMessageEmbed = embedId => {
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
	    const {Embed} = require(path.join(__dirname, "commands", file));
        if (Embed !== undefined) {
            if (Embed.embedId === embedId) {
                return Embed.embed;
            }
        }
    }
}

module.exports = {
    ButtonHandler: async (interaction, client) => {
        if (!interaction.isButton()) return;
    
        const data = JSON.parse(interaction.customId);
        const adminPerms = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    
        switch (data.func) {
            case "ChooseTime":
                const selectTimeBtns = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(JSON.stringify({
                                "func": "RenderChart",
                                "code": data.code,
                                "time": 1,
                                "timeLabel": "past day",
                                "embedId": data.embedId
                            }))
                            .setLabel("Past Day")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId(JSON.stringify({
                                "func": "RenderChart",
                                "code": data.code,
                                "time": 7,
                                "timeLabel": "past week",
                                "embedId": data.embedId
                            }))
                            .setLabel("Past Week")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId(JSON.stringify({
                                "func": "RenderChart",
                                "code": data.code,
                                "time": 999,
                                "timeLabel": "all time",
                                "embedId": data.embedId
                            }))
                            .setLabel("All Time")
                            .setStyle("PRIMARY")
                    );
    
                return interaction.update({components: [selectTimeBtns]});
                break;
            case "RenderChart":
                let messageEmbed = GetMessageEmbed(data.embedId);

                if (messageEmbed != undefined) {
                    RenderChart(data.code, data.time, await GetStockOverTime(data.code, data.time, "price")).then(async imgName => {
                        const attachment = new MessageAttachment(path.join(__dirname, "img", imgName), imgName);
                        messageEmbed.image = {url: `attachment://${imgName}`}
                        
                        await interaction.update({embeds: [messageEmbed], files: [attachment]});
                        fs.unlink(path.join(__dirname, "img", imgName), err => {
                            if (err) console.error(err);
                        });
                    }).catch(err => {
                        console.error(err);
                        messageEmbed.image.url = "https://via.placeholder.com/512x512.png?text=Error+Rendering+Chart";
                        return interaction.update({embeds: [messageEmbed]});
                    });
                }
                break;
            case "accept":
                if (adminPerms) {
                    CreateStockInfo(data.code.toLowerCase(), interaction.guild, interaction.channel);
                    ReviewStockInfo(data.code.toLowerCase(), client, interaction.channel);

                    configEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle(`Code set as $${data.code.toUpperCase()}. Your server will be reviewed once by our team to make sure there is no schemes.`);
                    return interaction.update({embeds: [configEmbed.toJSON()], components: []});
                }
                break;
            case "cancel":
                if (adminPerms) {
                    cancelEmbed = new MessageEmbed()
                        .setColor("#03fc5e")
                        .setTitle("Server Configuration Cancelled");

                    return interaction.update({embeds: [cancelEmbed.toJSON()], components: []});
                }
                break;
        }
    }
}