const logger = require('../util/logger');
const { commands } = require('../handlers/commands');
const { replyEmbed, replyError, replyWarn } = require('../util/util');


function setup(bot) {

    bot.on('raw', d => bot.manager.updateVoiceState(d));


    bot.on('ready', () => {
        bot.user.setActivity('/help | /play', { type: 'LISTENING' });
    });


    bot.on('warn', msg => {
        logger.warn(msg);
    });

    bot.on('error', e => {
        logger.error(e.message, e.stack || e);
    });


    // Register command runners
    bot.on('interactionCreate', i => {
        if (!(i.isCommand() || i.isButton())) return;

        const { commandName, customId } = i;

        let reply = () => {
            i.deferUpdate();
        };
        reply.warn = () => i.deferUpdate();
        reply.error = () => i.deferUpdate();

        if (i.isCommand()) {
            reply = (...args) => replyEmbed(i, ...args);
            reply.warn = (...args) => replyWarn(i, ...args);
            reply.error = (...args) => replyError(i, ...args);
        }

        commands.find(cmd => {
            const cmds = cmd.aliases ? [cmd.name, ...cmd.aliases]
                                     : [cmd.name];
            return cmds.includes(commandName) || cmds.includes(customId);
        })?.run(i, reply);
    });
}

module.exports = { setup };