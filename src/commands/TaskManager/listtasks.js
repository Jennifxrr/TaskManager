const tasksModel = require('../../schemas/tasks');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const timebetween = require('../../utils/timebetween');

module.exports = {
	name: 'listtasks',
	description: 'View a list of all your tasks.',
	options: [
		{ name: 'ongoing', type: ApplicationCommandOptionType.Subcommand, description: 'View your ongoing tasks.' },
		{ name: 'completed', type: ApplicationCommandOptionType.Subcommand, description: 'View your completed tasks.' },
	],
	async execute(client, interaction) {

		let page = 1;

		const tasksDoc = await tasksModel.findOne({
			guildId: interaction.guild.id,
			userId: interaction.user.id,
		});

		if (!tasksDoc) {
			const error = client.error('Invalid Task List!', 'You do not have any tasks created yet!');
			return interaction.reply({ embeds: [error], flags: 64 });
		}

		const totalTasks = tasksDoc.tasks.length;
		const totalPages = Math.ceil(totalTasks / 10);

		async function generateEmbed(pg, status) {

			const embed = client.embed(true)
				.setTitle(`Your ${status} Tasks`);

			if (tasksDoc.tasks.length === 0) {
				return client.embed()
					.setTitle(`Your ${status} Tasks`)
					.setDescription(`No ${status} Tasks Found!`)
					.setFooter({
						text: `${client.config.embedFooter} | Page ${pg}/${totalPages}`,
						iconURL: client.config.embedImage,
					});
			}

			if (status == 'Ongoing') {

				const tasks = tasksDoc.tasks.filter(task => task.complete === (status === 'Ongoing' ? false : true));

				const start = (pg - 1) * 10;
				const end = start + 10;
				const tasksForPage = tasks.slice(start, end);

				if (tasksForPage.length === 0) {
					return client.embed()
						.setTitle(`Your ${status} Tasks`)
						.setDescription(`No ${status} Tasks Found For This Page!`)
						.setFooter({
							text: `${client.config.embedFooter} | Page ${pg}/${totalPages}`,
							iconURL: client.config.embedImage,
						});
				}
				else {

					const datenow = new Date(Date.now());

					const description = await Promise.all(tasksForPage.map(async (t, index) => {
						return `\`Task #${(pg - 1) * 10 + index + 1}\` **${t.title}** : ⌚ ${t.dateString} (${timebetween(datenow, t.dueDate).join(' ')})`;
					}));

					embed.setDescription(description.join('\n'));
					embed.setFooter({
						text: `${client.config.embedFooter} | Page ${pg}/${totalPages}`,
						iconURL: client.config.embedImage,
					});

					return embed;

				}

			}
			else {

				const tasks = tasksDoc.tasks.filter(task => task.complete === (status === 'Complete' ? false : true));

				const start = (pg - 1) * 10;
				const end = start + 2;
				const tasksForPage = tasks.slice(start, end);

				if (tasksForPage.length === 0) {
					return client.embed()
						.setTitle(`Your ${status} Tasks`)
						.setDescription(`No ${status} Tasks Found For This Page!`)
						.setFooter({
							text: `${client.config.embedFooter} | Page ${pg}/${totalPages}`,
							iconURL: client.config.embedImage,
						});
				}
				else {

					const description = await Promise.all(tasksForPage.map(async (t, index) => {
						return `\`Task #${(pg - 1) * 10 + index + 1}\` **${t.title}** Completed At ${t.dateCompletedString}`;
					}));

					embed.setDescription(description.join('\n'));
					embed.setFooter({
						text: `${client.config.embedFooter} | Page ${pg}/${totalPages}`,
						iconURL: client.config.embedImage,
					});

					return embed;

				}
			}

		}

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('previous')
				.setEmoji('◀')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === 1),
			new ButtonBuilder()
				.setCustomId('next')
				.setEmoji('▶')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === totalPages),
		);

		let embedtosend;

		if (interaction.options.getSubcommand() == 'ongoing') {
			embedtosend = await generateEmbed(page, 'Ongoing');
		}
		else {
			embedtosend = await generateEmbed(page, 'Completed');
		}

		const msgembed = await interaction.reply({ embeds: [embedtosend], components: [row], flags: 64 });
		const message = await msgembed.fetch();

		const collector = message.createMessageComponentCollector({
			time: 60000000,
		});

		collector.on('collect', async (button) => {

			if (button.customId === 'next') {
			  page++;
			}
			else if (button.customId === 'previous') {
			  page--;
			}

			let newEmbed;
			if (interaction.options.getSubcommand() == 'ongoing') {
				newEmbed = await generateEmbed(page, 'Ongoing');
			}
			else {
				newEmbed = await generateEmbed(page, 'Completed');
			}

			await interaction.editReply({ embeds: [newEmbed], components: [row], flags: 64 });

			// Disable buttons accordingly
			row.components[0].setDisabled(page === 1);
			row.components[1].setDisabled(page === totalPages);

			await interaction.editReply({ components: [row] });

			await button.deferUpdate();
		  });

	},
};