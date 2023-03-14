const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('riddle')
		.setDescription('Ask a random riddle.'),
	async execute(interaction) {
		await interaction.reply('What belongs to you, but others will use it?'); // Your name
	},
};
