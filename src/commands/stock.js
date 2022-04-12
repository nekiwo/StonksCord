const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, UpdateStock} = require("../StocksAPI");
const {FindGuild} = require("../helpers");
const {client} = require("../index");

let lastBtnPressTime = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stock")
		.setDescription("Info for a specific stock")
        .addStringOption(option =>
            option.setName("code")
                .setDescription("Stock code or server link")
                .setRequired(true)),
	async execute(interaction) {
        if (interaction) {
            const stringInput = interaction.options.getString("code");

            let guild;
            let stockCode;
            let stockInfo;

            if (!stringInput.includes("/")) {
                if (stringInput[0] === "$") {
                    if (stringInput.length < 6) {
                        stockCode = stringInput.replace("$", "").toLowerCase();
                        stockInfo = await GetStockInfo(stockCode, false);
                        if (stockInfo === {}) {
                            return interaction.reply("Sorry, specified stock code was not found");
                        }
                    } else {
                        return interaction.reply("Sorry, specified stock code was too long (and wrong)");
                    }
                } else {
                    return interaction.reply("Sorry, you need to add `$` before your stock code");
                }
            } else {
                stockInfo = await GetStockInfo(stringInput.substring(stringInput.lastIndexOf("/") + 1), true);
                if (stockInfo === {}) {
                    return interaction.reply("Sorry, specified server doesn't have StonksCord invited (Or your link was incorrect)");
                }
                stockCode = stockInfo.ID;
            }

            guild = FindGuild(stockInfo.GuildID);
            if (guild == undefined) {
                return interaction.reply("Sorry, specified stock code was not found");
            }

            let memberCount = guild.members.cache.filter(member => !member.user.bot).size;
            UpdateStock(stockCode, memberCount, stockInfo.TotalShares);

            let tom = Date.now()
            
            const stockEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for $${stockCode.toUpperCase()}`)
                .setThumbnail(guild.iconURL())
                //.setDescription(`[Click here for invite Link](${stockInfo.Invite})`)
                .addFields({
                    name: "Stonk Price",
                    value: stockInfo.Cost,
                    inline: true
                }, {
                    name: "Market Cap",
                    value: stockInfo.MarketCap,
                    inline: true
                }, {
                    name: "Total Shares",
                    value: stockInfo.TotalShares,
                    inline: true
                }, {
                    name: "Server",
                    value: `[${guild.name}](${stockInfo.Invite})`,
                    inline: true
                }, {
                    name: "Member Count",
                    value: memberCount.toString(),
                    inline: true
                })
                .toJSON();

            const showGraphBtn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(JSON.stringify({
                            "func": "ChooseTime",
                            "stock": stockCode
                        }))
                        .setLabel("Show Charts")
                        .setStyle("PRIMARY")
                );

            client.on("interactionCreate", async i => {
                if (!i.isButton()) return;

                const data = JSON.parse(i.customId);
                console.log(i.customId)

                switch (data.func) {
                    case "ChooseTime":
                        const selectTimeBtn = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(JSON.stringify({
                                        "func": "RenderChart",
                                        "stock": stockCode,
                                        "time": 1,
                                        "timeLabel": "past day"
                                    }))
                                    .setLabel("Past Day")
                                    .setStyle("PRIMARY"),
                                new MessageButton()
                                    .setCustomId(JSON.stringify({
                                        "func": "RenderChart",
                                        "stock": stockCode,
                                        "time": 7,
                                        "timeLabel": "past week"
                                    }))
                                    .setLabel("Past Week")
                                    .setStyle("PRIMARY"),
                                new MessageButton()
                                    .setCustomId(JSON.stringify({
                                        "func": "RenderChart",
                                        "stock": stockCode,
                                        "time": 999,
                                        "timeLabel": "all time"
                                    }))
                                    .setLabel("All Time")
                                    .setStyle("PRIMARY")
                            );

                        return i.update({components: [selectTimeBtn]});
                        break;
                    case "RenderChart": 
                        let now = Date.now();

                        // Prevent user from spamming the button more than once 3 seconds
                        if (now - lastBtnPressTime > 3000) {
                            lastBtnPressTime = now;

                            const chartEmbed = new MessageEmbed()
                                .setColor("#03fc5e")
                                .setTitle(`Stock chart for $${data.stock.toUpperCase()}`)
                                .setDescription(`Shown: past ${data.timeLabel}`)
                                .toJSON();
    
                            return i.reply({embeds: [chartEmbed]});
                        } else {
                            return i.reply({content: "Stop spamming the buttons!"});
                        }

                        break;
                }
            
            });
            
            return interaction.reply({embeds: [stockEmbed], components: [showGraphBtn]});
        }
	},
};