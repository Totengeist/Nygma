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
                .addStringOption(option =>
                        option.setName('list-id')
                              .setDescription('The ID for the list to add the riddle to. (/list-lists)')
			      .setRequired(true))
                .addUserOption(option => option.setName('user').setDescription('The user who provided the riddle')),

	async execute(interaction) {

		const source = interaction.options.getUser('user');
		const question = interaction.options.getString('question');
		const listSlug = interaction.options.getString('list-id');

		const list = await prisma.list.findUnique({
		  where: {
		    slug: listSlug,
		  },
		})

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
		    listId: list.id,
		  },
		})

		await interaction.reply("Question by "+user.name+" added.");
	}
};
