const { Schema, model } = require('mongoose');

const tasks = new Schema({
	guildId: String,
	userId: String,
	timezone: {
		type: String,
		default: 'UTC',
	},
	tasks: {
		type: Array,
		default: [],
	},
});

module.exports = model('tasks', tasks);