const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('fix-esm').require('nanoid');

const prisma = new PrismaClient();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-lists')
		.setDescription('Show a list of lists to choose from.'),

	async execute(interaction) {

		const lists = await prisma.list.findMany({})

		var output = "";
		console.log(JSON.stringify(lists));
		lists.forEach(function(element) {
			output += element["title"]+"\n";
		});
		await interaction.reply(output);
	}
};
