const { Schema, model } = require('mongoose');

const perms = new Schema({
	guildId: String,
	commandName: String,
	roles: Array,
});

module.exports = model('permissions', perms);