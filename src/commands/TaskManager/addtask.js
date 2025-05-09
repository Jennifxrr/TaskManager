const { ApplicationCommandOptionType } = require('discord.js');
const taskModel = require('../../schemas/tasks');
const timebetween = require('../../utils/timebetween');

module.exports = {
	name: 'addtask',
	description: 'Create a task.',
	options: [
		{ name: 'title', type: ApplicationCommandOptionType.String, description: 'The title of the task.', required: true },
		{ name: 'description', type: ApplicationCommandOptionType.String, description: 'The description of the task.', required: true },
		{ name: 'month', type: ApplicationCommandOptionType.Integer, description: 'Enter the number of the month (1-12) of the due date.', required: true },
		{ name: 'day', type: ApplicationCommandOptionType.Integer, description: 'Enter the number of the day (1-31) of the due date.', required: true },
		{ name: 'year', type: ApplicationCommandOptionType.Integer, description: 'Enter the year (1999+) of the due date.', required: true },
		{ name: 'hours', type: ApplicationCommandOptionType.Integer, description: 'Enter the hour of the day in military time. (0-23).', required: true },
		{ name: 'minutes', type: ApplicationCommandOptionType.Integer, description: 'Enter the minute of the hour. (0-60).', required: true },
	],
	async execute(client, interaction) {

		const title = interaction.options.getString('title');
		const description = interaction.options.getString('description');
		let month = interaction.options.getInteger('month');
		let day = interaction.options.getInteger('day');
		const year = interaction.options.getInteger('year');
		let hours = interaction.options.getInteger('hours');
		let minutes = interaction.options.getInteger('minutes');

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

		let taskExists = false;

		taskDoc.tasks.forEach(task => {
			if (task.title.toLowerCase() == title.toLowerCase()) {
				if (task.complete == false) {
					taskExists = true;
				}
			}
		});

		if (taskExists == true) {
			const error = client.error('Duplicate Task Name', 'You can not create two tasks with the same name!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		if (month < 1 || month > 12) {
			const montherror = client.error('Invalid Month!', 'You may only insert a number 1-12!');
			return interaction.reply({ embeds: [montherror], flags: 64 });
		}

		if (day < 1 || day > 31) {
			const dayerror = client.error('Invalid Day!', 'You may only insert a number 1-31!');
			return interaction.reply({ embeds: [dayerror], flags: 64 });
		}

		if (month == 2 && day > 28) {
			const februaryerror = client.error('Invalid Day!', 'February only has 28 days! You may only insert a number 1-28!');
			return interaction.reply({ embeds: [februaryerror], flags: 64 });
		}

		if (month == 4 && day > 30 || month == 6 && day > 30 || month == 9 && day > 30 || month == 11 && day > 30) {
			const monthserror = client.error('Invalid Day!', 'April, June, September, and November only have 30 days! You may only insert a number 1-30!');
			return interaction.reply({ embeds: [monthserror], flags: 64 });
		}

		if (year < 1999) {
			const yearerror = client.error('Invalid Year!', 'You may only insert a number greater than 1999!');
			return interaction.reply({ embeds: [yearerror], flags: 64 });
		}

		if (hours < 0 || hours > 23) {
			const hourerror = client.error('Invalid Hour!', 'You may only insert a number 0-23!');
			return interaction.reply({ embeds: [hourerror], flags: 64 });
		}

		month = month.toString().padStart(2, '0');
		day = day.toString().padStart(2, '0');
		hours = hours.toString().padStart(2, '0');
		minutes = minutes.toString().padStart(2, '0');


		const duedate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

		const datenow = new Date(Date.now());

		if (taskDoc.difference == '+') {
			duedate.setHours(duedate.getHours() - taskDoc.hour);
		}
		else {
			duedate.setHours(duedate.getHours() + taskDoc.hour);
		}

		const duedatestring = new Date(duedate.toISOString());

		if (datenow > duedate) {
			const pastdate = client.error('Invalid Date!', 'You can only schedule tasks for future time!');
			return interaction.reply({ embeds: [pastdate], flags: 64 });
		}

		const taskObject = {
			title: title,
			description: description,
			dueDate: duedatestring,
			dateString: `${month}/${day}/${year} at ${hours}:${minutes}`,
			complete: false,
			dateCompletedString: 'N/A',
		};

		taskDoc.tasks.push(taskObject);
		taskDoc.save().catch(() => {return;});

		const embed = client.embed(true)
			.setTitle('Task Created!')
			.addFields([
				{ name: 'Title', value: `${title}` },
				{ name: 'Description', value: `${description}` },
				{ name: 'Due Date', value: `${month}/${day}/${year} at ${hours}:${minutes}` },
				{ name: '⌚ Time Left', value: `${timebetween(datenow, duedatestring).join(' ')}` },
			]);

		interaction.reply({ embeds: [embed], flags: 64 });

	},
};