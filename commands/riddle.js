const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('riddle')
		.setDescription('Ask a random riddle.'),
	async execute(interaction) {
		// run inside `async` function
	        const questionsCount = await prisma.riddle.count();
	        const skip = Math.floor(Math.random() * questionsCount);
	        questionObj =  await prisma.riddle.findFirst({
	                skip: skip,
	                include: {
	                        author: true,
	                }
	        });

		authorName = questionObj.author.name;
		question = questionObj.question;

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Riddle')
			.setDescription(question)
			.setFooter({ text: 'Riddle provided by ' + authorName });

		await interaction.reply({ content: '@DeadChat', embeds: [exampleEmbed] });
	},
};
