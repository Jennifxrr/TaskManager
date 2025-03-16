const { ApplicationCommandOptionType } = require('discord.js');
const taskModel = require('../../schemas/tasks');

module.exports = {
	name: 'settimezone',
	description: 'Set your timezone in the UTC(+/-)(hour) format.',
	options: [
		{ name: 'difference', type: ApplicationCommandOptionType.String, description: 'Select if your timezone is - from UTC or + from UTC.', required: true, choices: [ { name: '-', value: '-' }, { name: '+', value: '+' } ] },
		{ name: 'hours', type: ApplicationCommandOptionType.Integer, description: 'The amount of hours your timezone needs to add or subtract for UTC.', required: true },
	],
	async execute(client, interaction) {

		const difference = interaction.options.getString('difference');
		const hours = interaction.options.getInteger('hours');

		let taskDoc = await taskModel.findOne({
			guildId: interaction.guild.id,
			userId: interaction.user.id,
		});

		if (!taskDoc) {
			taskDoc = await taskModel.create({
				guildId: interaction.guild.id,
				userId: interaction.user.id,
			});
		}

		taskDoc.difference = `${difference}`;
		taskDoc.hour = hours;

		taskDoc.save().catch(() => {return;});

		const success = client.success('Time Zone Changed!', `You have successfully changed your timezone to **UTC${difference}${hours}**!`);
		interaction.reply({ embeds: [success], flags: 64 });

	},
};