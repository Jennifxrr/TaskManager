const { ApplicationCommandOptionType } = require('discord.js');
const taskModel = require('../../schemas/tasks');

module.exports = {
	name: 'completetask',
	description: 'Complete a task.',
	options: [
		{ name: 'title', type: ApplicationCommandOptionType.String, description: 'The title of the task you would like to complete.', required: true },
	],
	async execute(client, interaction) {

		const task = interaction.options.getString('title');

		const taskDoc = await taskModel.findOne({
			guildId: interaction.guild.id,
			userId: interaction.user.id,
		});

		if (!taskDoc) {
			const error = client.error('No Tasks Avaliable', 'You do not have any tasks that you can complete!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		let taskObj;
		let taskIndex;

		for (let i = 0; i < taskDoc.tasks.length; i++) {
			if (taskDoc.tasks[i].title.toLowerCase() == task.toLowerCase()) {
				taskObj = taskDoc.tasks[i];
				taskIndex = i;
			}
		}

		if (!taskObj) {
			const error = client.error('Task Not Avaliable!', 'The task that you are trying to complete does not exist!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		if (taskObj.complete == true) {
			const error = client.error('Task Already Complete!', 'The task you are trying to complete is already completed!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		const now = new Date();
		const utcnow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

		if (taskDoc.difference == '+') {
			utcnow.setUTCHours(utcnow.getUTCHours() + taskDoc.hour);
		}
		else {
			utcnow.setUTCHours(utcnow.getUTCHours() - taskDoc.hour);
		}

		const userDateString = new Date(utcnow.toISOString());

		const newObj = {
			title: taskDoc.tasks[taskIndex].title,
			description: taskDoc.tasks[taskIndex].description,
			dueDate: taskDoc.tasks[taskIndex].dueDate,
			dateString: taskDoc.tasks[taskIndex].dateString,
			complete: true,
			dateCompletedString: `${(userDateString.getUTCMonth() + 1).toString().padStart(2, '0')}/${userDateString.getUTCDate().toString().padStart(2, '0')}/${userDateString.getUTCFullYear()} at ${userDateString.getUTCHours().toString().padStart(2, '0')}:${userDateString.getUTCMinutes().toString().padStart(2, '0')}`,
		};

		taskDoc.tasks[taskIndex] = newObj;
		taskDoc.save().catch(() => {return;});

		const success = client.success('Task Completed', `You have successfully completed the **${(userDateString.getUTCMonth() + 1).toString().padStart(2, '0')}/${userDateString.getUTCDate().toString().padStart(2, '0')}/${userDateString.getUTCFullYear()} at ${userDateString.getUTCHours().toString().padStart(2, '0')}:${userDateString.getUTCMinutes().toString().padStart(2, '0')}**`);
		interaction.reply({ embeds: [success], flags: 64 });

	},
};