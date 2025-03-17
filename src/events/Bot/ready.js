const { readdir } = require('fs');
const mongoose = require('mongoose');
const nextRunModel = require('../../schemas/schedule');
const checkOverdue = require('../../utils/checkOverdue');

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

		let nextRunDoc = await nextRunModel.findOne();

		if (!nextRunDoc) {
			nextRunDoc = new nextRunModel();
			await nextRunDoc.save().catch(() => {return;});
		}

		const now = new Date();
		const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
   		const nextRun = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 7, 0, 0));

		if (nowUTC > nextRun) {
			nextRun.setUTCDate(nextRun.getUTCDate() + 1);
		}

		nextRunDoc.nextRun = nextRun;
		await nextRunDoc.save().catch(() => {return;});

		const timeUntilNextRun = nextRun.getTime() - now.getTime();

		setTimeout(() => {
			checkOverdue(client);
			setInterval(checkOverdue, 86400000);
		}, timeUntilNextRun);

	},
};
