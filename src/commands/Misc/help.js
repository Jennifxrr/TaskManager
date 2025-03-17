module.exports = {
	name: 'help',
	description: 'View all the commands on the bot',
	async execute(client, interaction) {

		const embed = client.embed(true)
			.setTitle('/Help (6 Commands)')
			.setDescription([
				'**Misc Commands**',
				'`/help` - Shows all the commands on the bot.',
				'`/perm` - Set the permissions of a command.\n',
				'**Task Manager Commands**',
				'`/addtask` - Add a task to the bot.',
				'`/completetask` - Complete a task that you have created.',
				'`/listtasks` - you can decide if you want to list completed or ongoing tasks with this command.',
				'`/settimezone` - Set the timezone that you would like the bot to track your tasks with. ',
			].join('\n'));

		interaction.reply({ embeds: [embed], flags: 64 });

	},
};