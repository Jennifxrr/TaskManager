const { Schema, model } = require('mongoose');

const schedule = new Schema({
	nextRun: Date,
});

module.exports = model('schedule', schedule);