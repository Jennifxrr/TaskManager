const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client(
	{ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences], partials: ['CHANNEL'] },
);
require('dotenv').config();

const fs = require('fs');
const yaml = require('js-yaml');

client.color = require('chalk');
client.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
client.commands = new Collection();
client.embed = require('./src/utils/embed');
client.error = require('./src/utils/error');
client.success = require('./src/utils/success');

const eHandler = require('./src/handlers/event');
eHandler(client);

client.login(process.env.BOTTOKEN);