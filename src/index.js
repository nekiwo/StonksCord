const fs = require("fs");
const {Client, Collection, Intents} = require("discord.js");
const {Token} = require("./config.json");

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
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

client.on("guildCreate", guild => {
    const channels = guild.channels.cache.filter(channel => channel.type == "text");

    channels.first()
        .send("Hello! Start by using the `/help` command. Then, use the `/configure` command in order to put your server on the stonk market")
        .catch(e => console.log(e));
});

client.login(Token);