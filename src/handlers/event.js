const { readdirSync } = require('fs');

module.exports = async client => {

	let count = 0;

	readdirSync('./src/events/').forEach(folder => {

		const events = readdirSync(`./src/events/${folder}/`).filter(file => file.endsWith('.js'));

		for (const event of events) {
			const file = require(`../events/${folder}/${event}`);
			count = count += 1;
			if (file.once) {
				client.once(file.name, (...args) => file.run(...args, client));
			}
			else {
				client.on(file.name, (...args) => file.run(...args, client));
			}
		}
	});

};

