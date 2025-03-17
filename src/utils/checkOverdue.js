const taskModel = require('../schemas/tasks');
const timebetween = require('../utils/timebetween');

module.exports = async (client) => {

	const now = new Date();
	const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));

	const taskDoc = await taskModel.find({});

	taskDoc.forEach(async doc => {
		doc.tasks.forEach(async task => {
			if (task.complete == false && task.dueDate < nowUTC) {

				const user = await client.users.fetch(doc.userId);

				const overdueEmbed = client.embed()
					.setTitle('⚠ Overdue Task ⚠')
					.addFields([
						{ name: 'Title', value: `${task.title}` },
						{ name: 'Description', value: `${task.description}` },
						{ name: 'Due Date', value: `${task.dateString}` },
						{ name: '⌚ Late By', value: `${timebetween(task.dueDate, nowUTC).join(' ')}` },
					]);


				await user.send({ embeds: [overdueEmbed] }).catch(() => {return;});


			}
		});
	});

};