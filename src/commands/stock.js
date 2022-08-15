const path = require("path");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") ;
const {SlashCommandBuilder} = require("@discordjs/builders");
const {GetStockInfo, UpdateStockInfo} = require(path.join(__dirname, "..", "StocksAPI"));
const {FindGuild, TotalMembers} = require(path.join(__dirname, "..", "helpers"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stock")
		.setDescription("Info for a specific stock")
        .addStringOption(option => option
            .setName("code")
            .setDescription("Stock code or server link")
            .setRequired(true)),
	async execute(interaction, client) {
        if (interaction) {
            const stringInput = interaction.options.getString("code");

            let guild;
            let stockCode;
            let stockInfo;

            if (!stringInput.includes("/")) {
                if (stringInput[0] === "$") {
                    if (stringInput.length < 6) {
                        stockCode = stringInput.replace("$", "").toLowerCase();
                        stockInfo = await GetStockInfo(stockCode, "id");
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
                stockInfo = await GetStockInfo(stringInput.substring(stringInput.lastIndexOf("/") + 1), "invite");
                if (stockInfo === {}) {
                    return interaction.reply("Sorry, specified server doesn't have StonksCord invited (or your link was incorrect)");
                }
                stockCode = stockInfo.ID;
            }

            guild = FindGuild(stockInfo.GuildID, client);
            if (guild == undefined) {
                return interaction.reply("Sorry, specified stock code was not found");
            }

            let memberCount = await TotalMembers(stockInfo.Invite);
            UpdateStockInfo(stockCode, memberCount, stockInfo.TotalShares, stockInfo.Price);

            stockInfo = await GetStockInfo(stockCode, "id");
            
            let stockEmbed = new MessageEmbed()
                .setColor("#03fc5e")
                .setTitle(`Stock info for $${stockCode.toUpperCase()}`)
                .setThumbnail(guild.iconURL())
                //.setDescription(`[Click here for invite Link](${stockInfo.Invite})`)
                .addFields({
                    name: "Stonk Price",
                    value: stockInfo.Price.toString() + "$",
                    inline: true
                }, {
                    name: "Market Cap",
                    value: (stockInfo.TotalShares * stockInfo.Price).toString() + "$",
                    inline: true
                }, {
                    name: "Total Shares",
                    value: stockInfo.TotalShares.toString(),
                    inline: true
                }, {
                    name: "Member Count",
                    value: memberCount.toString(),
                    inline: true
                }, {
                    name: "Server",
                    value: `[${guild.name}](${stockInfo.Invite})`,
                    inline: true
                });

            module.exports.Embed.embedId = Date.now().toString();
            module.exports.Embed.embed = stockEmbed.toJSON();

            const showGraphBtn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(JSON.stringify({
                            "func": "ChooseTime",
                            "code": stockCode,
                            "embedId": module.exports.Embed.embedId
                        }))
                        .setLabel("Show Charts")
                        .setStyle("PRIMARY")
                );
            
            return interaction.reply({embeds: [stockEmbed.toJSON()], components: []});
        }
	},

    Embed: {
        embedId: "",
        embed: {}
    }
};