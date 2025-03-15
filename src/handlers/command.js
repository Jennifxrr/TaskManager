const { readdirSync } = require('fs');
const wait = require('node:timers/promises').setTimeout;
const permissionModel = require('../schemas/perms');

module.exports = async client => {

	let count = 0;

	readdirSync('./src/commands/').forEach(folder => {

		const commands = readdirSync(`./src/commands/${folder}/`).filter(file => file.endsWith('.js'));

		for (const command of commands) {
			const file = require(`../commands/${folder}/${command}`);
			count = count += 1;
			client.commands.set(file.name, file);

			const data = {
				name: file.name,
				description: file.description || 'No Description',
				options: file.options ? file.options : [],
			};

			client.guilds.cache.forEach(guild => {
				guild.commands.create(data)
					.catch(() => {
						return;
					});
			});

			client.guilds.cache.forEach(async guild => {

				client.commands.map(async (c) => {
					const permissionDoc = await permissionModel.findOne({ guildId: guild.id, commandName: c.name });
					if (!permissionDoc) {
						await permissionModel.create({
							guildId: guild.id,
							toggleStatus: 'enabled',
							commandName: c.name,
							roles: [],
						});
						console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(` I have created a permission entry for the command: ${c.name}`));

					}
				});

			});

		}
	});

	await wait(1000);

	console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(` ${count} commands loaded successfully!`));


};

