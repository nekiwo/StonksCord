const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
const configTemplatePath = path.join(__dirname, "config_template.json");
let Token;

if (fs.existsSync(configPath)) {
    Token = require(configPath).Token;
} else {
    const template = fs.readFileSync(configTemplatePath, "utf8");

    let data = JSON.parse(template);
    data.ClientId = process.env.SC_CLIENT_ID.toString();
    data.Token = process.env.SC_TOKEN;
    Token = process.env.SC_TOKEN;

    data.DBConfig.db.host = process.env.SC_HOST;
    data.DBConfig.db.port = process.env.SC_PORT.toString();
    data.DBConfig.db.user = process.env.SC_USER;
    data.DBConfig.db.password = process.env.SC_PASSWORD;
    data.DBConfig.db.database = process.env.SC_DATABASE;

    fs.writeFileSync(configPath, JSON.stringify(data));
}

const {Client, Collection, Intents} = require("discord.js");
const {MessageCounter} = require(path.join(__dirname, "MessageCounter"));
const {ButtonHandler} = require(path.join(__dirname, "ButtonHandler"));

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(path.join(__dirname, "commands", file));
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		return interaction.reply({content: "Sorry, there has been an error", ephemeral: true});
	}
});

client.on("messageCreate", async message => {
	if (!message.author.bot) {
        MessageCounter(message.guild.id, message.author.id);
    }

    // daily scoreboards
    var stocksChannel = client.channels.get(928729255699959839);
    channel.messages.fetch({ limit: 1 }).then(async messages => {
      let lastMessage = messages.first();

      var lasttime = lastMessage.createdAt;
      var currenttime = Date();

      var diffMS = currenttime - lasttime;

      if((diffMS / 1000) > 86400) {
            bestStocksEmbed = new MessageEmbed() // taken from scoreboard command
              .setColor("#03fc5e")
              .setTitle("Top 10 best performing stonks");

            const bestStocks = await GetTopStocksList(false);

            itemsLength = bestStocks.length;
            placeFormat = (i) => {
              bestStocksEmbed.addField(`#${i} $${bestStocks[i - 1].Code.toUpperCase()}`,
                  `Change over 7 days: ${bestStocks[i - 1].Change}$ ${chartEmoji(bestStocks[i - 1].Change)}`,
                  false
              );
            }
            worstStocksEmbed = new MessageEmbed() // taken from scoreboard command
              .setColor("#03fc5e")
              .setTitle("Top 10 worst performing stonks");

            const worstStocks = await GetTopStocksList(true);

            itemsLength = worstStocks.length;
            placeFormat = (i) => {
              worstStocksEmbed.addField(
                  `#${i} $${worstStocks[i - 1].Code.toUpperCase()}`,
                  `Change over 7 days: ${worstStocks[i - 1].Change}$ ${chartEmoji(worstStocks[i - 1].Change)}`,
                  false
              );
            }

            stocksChannel.send({
                content: 'Best/worst performing stocks:',
                embeds: [bestStocksEmbed, worstStocksEmbed],
            });
      }

    })
    .catch(console.error);
});

client.on("interactionCreate", async interaction => ButtonHandler(interaction, client));

client.on("guildCreate", guild => {
    const channels = guild.channels.cache.filter(channel => channel.type == "text");

    if (channels > 0) {
        channels.first()
            .send("Hello! Start by using the `/help` command. Then, use the `/configure` command in order to put your server on the stonk market")
            .catch(e => console.log(e));
    }

});

client.login(Token);
