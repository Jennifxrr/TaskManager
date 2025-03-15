const { readdir } = require('fs');
const mongoose = require('mongoose');

module.exports = {
	name: 'ready',
	once: true,
	run: async (client) => {

		console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(` I have successfully been logged in as ${client.user.tag}`));

		readdir('./commands.', () => {
			const cHandler = require('../../handlers/command');
			cHandler(client);
		});

		mongoose.connect(process.env.DBSTRING)
			.then(() => {
				console.log(client.color.hex('#008000').bold('✔') + client.color.hex('#FFFFFF')(' I have connected to the database!'));
			})
			.catch(() => {
				console.log(client.color.hex('#ff0000').bold('X') + client.color.hex('#FFFFFF')(' I have failed to connect to the database!'));
				client.destroy();
			});

		console.log(client.color.hex('FFFF00').bold('?') + client.color.hex('#FFFFFF')(` I am in ${client.guilds.cache.size} guild(s)!`));

	},
};
