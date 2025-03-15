const { EmbedBuilder } = require('discord.js');

module.exports = (title, description) => {

	const embed = new EmbedBuilder()
		.setTitle(`Success: ${title}`)
		.setDescription(`${description}`)
		.setColor('#008000');

	return embed;
};