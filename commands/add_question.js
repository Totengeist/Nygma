const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-question')
		.setDescription('Ask a random question.')
		.addStringOption(option =>
			option.setName('question')
			      .setDescription('The question to ask')
			      .setRequired(true))
		.addUserOption(option => option.setName('user').setDescription('The user who provided the riddle')),
	async execute(interaction) {

		const source = interaction.options.getUser('user');
		const question = interaction.options.getString('question');

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

		const new_riddle = await prisma.question.create({
		  data: {
		    authorId: user.id,
		    question: question,
		    active: true,
		  },
		})

		await interaction.reply("Question by "+user.name+" added.");
	}
};
