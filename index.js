const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { env } = require('./dotenv.js')

// Initialize the Discord client
const client = new Client({
  intents: [
		GatewayIntentBits.Guilds,
	],
});

// Load commands.
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Process commands.
client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('ready', () => {
  // Set the bot's presence
  if( env("USERNAME") != client.user.username) {
    console.log("Changing username from "+client.user.username+" to "+env("USERNAME"));
    client.user.setUsername(env("USERNAME"));
  }
  client.user.setPresence({ activity: { name: 'Preparing riddles...' } });
  console.log("Logged in");
});

// Log in to Discord using the client ID and secret
client.login(env("DISCORD_TOKEN"));
