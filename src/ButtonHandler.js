const fs = require("fs");
const {MessageActionRow, MessageButton, MessageAttachment} = require("discord.js") 
const {GetStockOverTime} = require("./StocksAPI");
const {RenderChart} = require("./RenderChart");

let GetMessageEmbed = embedId => {
    const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
	    const {Embed} = require(`./commands/${file}`);
        if (Embed !== undefined) {
            if (Embed.embedId === embedId) {
                return Embed.embed;
            }
        }
    }
}

module.exports = {
    ButtonHandler: async interaction => {
        if (!interaction.isButton()) return;
    
        const data = JSON.parse(interaction.customId);
    
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

                RenderChart(data.code, data.time, await GetStockOverTime(data.code, data.time, "price")).then(async imgName => {
                    const attachment = new MessageAttachment(`./img/${imgName}`, imgName);
                    /*stockEmbed.setImage(`attachment://${imgName}`);
                    console.log(stockEmbed.toJSON())
                    await interaction.update({embeds: [stockEmbed.toJSON()], files: [attachment]});*/
                    messageEmbed.image = {
                        url: `attachment://${imgName}`
                    }
                    await interaction.update({embeds: [messageEmbed], files: [attachment]});

                    fs.unlink(`./img/${imgName}`, err => {
                        if (err) console.error(err);
                    });
                }).catch(err => {
                    console.error(err);
                    /*stockEmbed.setImage("https://via.placeholder.com/512x512.png?text=Error+Rendering+Chart");
                    return interaction.update({embeds: [stockEmbed.toJSON()]});*/
                    messageEmbed.image.url = "https://via.placeholder.com/512x512.png?text=Error+Rendering+Chart";
                    return interaction.update({embeds: [messageEmbed]});
                });
        }
    }
}