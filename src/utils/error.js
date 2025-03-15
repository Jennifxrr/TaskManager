const { EmbedBuilder } = require('discord.js');

module.exports = (title, description) => {

	const embed = new EmbedBuilder()
		.setTitle(`Error: ${title}`)
		.setDescription(`${description}`)
		.setColor('#e60000');

	return embed;
};