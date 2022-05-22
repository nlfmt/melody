/*
#   Quickly register your slash commands with this script.
#   You can choose to register to the application or only to a specific guild.
#
#   made by nlfmt aka Tom F (https://github.com/nlfmt)
#   MIT License
*/


const USAGE = 
`Usage: npm run register -- [clear] [guild_id]
    clear (optional): If specified, will clear the commands from the guild/application.
    guild_id (optional): The guild ID to register the commands to. Leave empty to register to the application.`


const log = console.log;
const warn = msg => console.warn('\x1b[33m' + msg + '\x1b[0m');
const error = msg => console.error('\x1b[31m' + msg + '\x1b[0m');
const success = msg => console.log('\x1b[32m' + msg + '\x1b[0m');


const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

if (clientId === undefined || token === undefined) {
    error('ERROR: Missing clientId or token in config.json\n');
    process.exit(0);
}

// Setup user confirmation prompt
const { question } = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


let [ guildId ] = process.argv.slice(2);
let commands = [];

if (['help', '--help', '-h'].includes(guildId)) {
    console.log(USAGE);
    process.exit(0);
}

// Find all commands
if (guildId !== 'clear') {
    fs.readdirSync('./bot/commands').forEach(dir => {
        fs.readdirSync(`./bot/commands/${dir}`).forEach(file => {
            const cmd = require(`./commands/${dir}/${file}`);
            const valid = cmd.name && cmd.name !== ''
                        && cmd.run
                        && cmd.description && cmd.description !== '';
            if (valid) {
                commands.push({
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.options || [],
                });
            }
            else {
                warn(`Command ${dir}/${file} is invalid.`);
            }
        });
    });
    if (commands.length > 0) success(`Found ${commands.length} commands...`);
    else warn('No commands found.');
    
} else {
    guildId = process.argv.length == 4 ? process.argv[3] : null;
}


const rest = new REST({ version: '9' }).setToken(token);
const ROUTE = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);

function register() {
    rest.put(ROUTE, { body: commands })
    .then(() => {
        success(`Successfully registered ${commands.length} ${guildId ? 'guild' : 'application'} command(s).\n`);
        process.exit(0);
    })
    .catch(console.error);
}

// Prompt for confirmation before clearing
if (commands.length == 0) {
    question(
        `\x1b[33mAre you sure you want to clear all commands for this ${guildId?'guild':'application'}? (y/n)\x1b[0m `,
        async answer => {
            if (answer == 'y') register();
    });
} else {
    register();
}