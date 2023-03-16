const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('fix-esm').require('nanoid');

const prisma = new PrismaClient();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-list')
		.setDescription('Create a list to add questions and riddles to.')
		.addStringOption(option =>
			option.setName('name')
			      .setDescription('The name of the list')
			      .setRequired(true)),
	async execute(interaction) {

		const title = interaction.options.getString('name');

		const user = await prisma.user.upsert({
		  where: {
		    discordId: interaction.user.id,
		  },
		  update: {},
		  create: {
		    discordId: interaction.user.id,
		    name: interaction.user.username,
		  },
		})

		const new_list = await prisma.list.create({
		  data: {
		    slug: nanoid(),
		    ownerId: user.id,
		    title: title,
		  },
		})

		await interaction.reply("List added: "+new_list.slug);
	}
};
