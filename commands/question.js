const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('question')
		.setDescription('Ask a random question.'),
	async execute(interaction) {
		// run inside `async` function
	        const questionsCount = await prisma.question.count();
	        const skip = Math.floor(Math.random() * questionsCount);
	        questionObj =  await prisma.question.findFirst({
	                skip: skip,
	                include: {
	                        author: true,
	                }
	        });

		authorName = questionObj.author.name;
		question = questionObj.question;

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Question')
			.setDescription(question)
			.setFooter({ text: 'Question provided by ' + authorName });

		await interaction.reply({ content: '@DeadChat', embeds: [exampleEmbed] });
	}
};
