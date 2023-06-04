const fs = require("fs");
const path = require("path");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {ClientId, Token} = require(path.join(__dirname, "..", "config.json"));

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(path.join(__dirname, "commands", file));
	commands.push(command.data.toJSON());
}

const rest = new REST({version: "9"}).setToken(Token);

rest.put(Routes.applicationCommands(ClientId), {body: commands})
	.then(() => console.log("Successfully registered application commands"))
	.catch(console.error);