const { EmbedBuilder } = require('discord.js');

const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

module.exports = (thumbnail) => {

	const embed = new EmbedBuilder()
		.setFooter({
			text: config.embedFooter,
			iconURL: config.embedImage,
		})
		.setColor(config.embedColor);


	if (thumbnail === true) {
		embed.setThumbnail(config.embedImage);
	}

	return embed;
};