const { ApplicationCommandOptionType } = require('discord.js');
const permissionModel = require('../../schemas/perms');

module.exports = {
	name: 'perm',
	description: 'View all the commands on the bot',
	options: [
		{ name: 'command', type: ApplicationCommandOptionType.String, description: 'The command you would like to set or view permissions for.', required: true },
		{ name: 'role', type: ApplicationCommandOptionType.Role, description: 'The role you would like to give access to.', required: false },
	],
	async execute(client, interaction) {

		const command = interaction.options.getString('command');
		const role = interaction.options.getRole('role');

		const permDoc = await permissionModel.findOne({
			guildId: interaction.guild.id,
			commandName: command,
		});

		if (!permDoc) {
			const error = client.error('Invalid Command', 'The command that you entered does not have permissions set up for it!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		if (role) {
			if (permDoc.roles.includes(role.id)) {
				permDoc.roles.splice(permDoc.roles.indexOf(role.id), 1);
				permDoc.save().catch((() => {return;}));
				const success = client.success('Permissions Edited!', `${role} no longer has access to run the ${command} command!`);
				interaction.reply({ embeds: [success], flags: 64 });
			}
			else {
				permDoc.roles.push(role.id);
				permDoc.save().catch((() => {return;}));
				const success = client.success('Permissions Edited!', `${role} now has access to run the ${command} command!`);
				interaction.reply({ embeds: [success], flags: 64 });
			}
		}
		else {
			const cmdPerms = [];

			permDoc.roles.forEach(pr => {
				const ro = interaction.guild.roles.cache.find(r => r.id === pr);
				if (ro) cmdPerms.push(ro);
			});

			const embed = client.embed(true)
				.setTitle(`/${command} permissions`)
				.setDescription(`${cmdPerms.length > 0 ? cmdPerms.join(' ') : 'No Permissions Set'}`);

			interaction.reply({ embeds: [embed] });

		}

	},
};