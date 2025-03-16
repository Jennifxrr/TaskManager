const { Schema, model } = require('mongoose');

const taskmanagement = new Schema({
	guildId: String,
	userId: String,
	difference: {
		type: String,
		default: '+',
	},
	hour: {
		type: Number,
		default: 0,
	},
	tasks: {
		type: Array,
		default: [],
	},
});

module.exports = model('taskmanagement', taskmanagement);