const fs = require('fs');
const logger = require('../util/logger');

const loadedCommands = [];

const setup = () => {


    // load all commands
    fs.readdirSync('./bot/commands').forEach(dir => {
        fs.readdirSync(`./bot/commands/${dir}`).forEach(file => {
            const cmd = require(`../commands/${dir}/${file}`);
            const valid = cmd.name && cmd.name !== ''
                          && cmd.run
                          && cmd.description && cmd.description !== '';
            if (valid) {
                loadedCommands.push(cmd);
            }
            else {
                logger.warn(`Command ${file} is not valid.`);
            }
        });
    });

    logger.info(`Loaded ${loadedCommands.length} commands.`);
};


module.exports = { setup, commands: loadedCommands };