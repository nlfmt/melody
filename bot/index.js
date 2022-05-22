const { Client } = require('discord.js');
const { Manager } = require('erela.js');
const fs = require('fs');

const config = require('./config.json');
const commands = require('./handlers/commands');
const logger = require('./util/logger');

const djsEvents = require('./events/discord');
const ejsEvents = require('./events/erela');

const Spotify = require('erela.js-spotify');


const ansiEscRegEx = /\u001b\[\d+m/g;

if (config.production === true) {
    const fstream = fs.createWriteStream('musicbot.log');
    const fsw = fstream.write.bind(fstream);
    
    // replace write functions and filter out ansi escape codes
    process.stdout.write = process.stderr.write = (...args) => {
        fsw(...args.map(a => {
            if (typeof a !== 'string') return a;
            return a.replace(ansiEscRegEx, '');
        }));
    }
}

if (!config.token || !config.clientId || !config.spotifyId || !config.spotifySecret) {
    logger.error('Missing token or clientId in config.json');
    process.exit(0);
}

// Initialize the bot
const bot = new Client({
    intents: 32767
});

bot.config = config;


// ErelaJS Setup
bot.manager = new Manager({
    nodes: [{
        host: 'localhost',
        password: 'youshallnotpass',
        port: 2333,
        retryDelay: 5000
    }],
    autoPlay: true,
    send: (id, payload) => {
        const guild = bot.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    plugins: [
        new Spotify({
            clientID: bot.config.spotifyId,
            clientSecret: bot.config.spotifySecret
        })
    ]
});


const activities = [
    ['LISTENING', '/play'],
    ['PLAYING', 'sick beats'],
    ['PLAYING', 'Music'],
]

bot.on('ready', () => {

    logger.info('Bot is ready!');

    // Initialize Erela Manager
    bot.manager.init(bot.user.id);

    // Command Handler
    commands.setup();

    // Events
    djsEvents.setup(bot);
    ejsEvents.setup(bot);

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        bot.user.setActivity(activity[1], { type: activity[0] });
    }, 15_000);
});

module.exports = {
    bot
}

// Connect to Discord
if (require.main === module) bot.login(config.token);
