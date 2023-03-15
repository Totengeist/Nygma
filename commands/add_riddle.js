const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-riddle')
		.setDescription('Ask a random riddle.')
		.addStringOption(option =>
			option.setName('riddle')
			      .setDescription('The riddle to ask')
			      .setRequired(true))
		.addStringOption(option =>
			option.setName('answer')
			      .setDescription('The answer to the given riddle')
			      .setRequired(true))
		.addUserOption(option => option.setName('user').setDescription('The user who provided the riddle')),
	async execute(interaction) {

		const source = interaction.options.getUser('user');
		const riddle = interaction.options.getString('riddle');
		const answer = interaction.options.getString('answer');

		const user = await prisma.user.upsert({
		  where: {
		    discordId: source.id,
		  },
		  update: {},
		  create: {
		    discordId: source.id,
		    name: source.username,
		  },
		})

		const new_riddle = await prisma.riddle.create({
		  data: {
		    authorId: user.id,
		    question: riddle,
		    answer: answer,
		    active: true,
		  },
		})

		await interaction.reply("Riddle by "+user.name+" added.");
	}
};
