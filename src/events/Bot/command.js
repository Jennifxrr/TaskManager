const permissionModel = require('../../schemas/perms');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (interaction, client) => {

		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		const args = [];

		for (const option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				option.options?.forEach((x) => {
					if (x.value) args.push(option.value);
				});
			}
			else {
				args.push(option.value);
			}
		}

		const permDoc = await permissionModel.findOne({
			guildId: interaction.guild.id,
			commandName: interaction.commandName,
		});

		if (!permDoc) {
			const error = client.error('Permission Error!', `There are no permissions set up for the **${interaction.commandName}** command!`);
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.find(r => permDoc.roles.includes(r.id))) {
			const error = client.error('Permission Error!', `You do not have the permission to run the **${interaction.commandName}** command!`);
			return interaction.reply({ embeds: [error], flags: 64 });
		}


		command.execute(client, interaction, args);

	},
};