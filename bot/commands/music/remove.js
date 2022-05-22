const { bot } = require('../../index');
const logger = require('../../util/logger');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Removes a song from the queue.',
    options: [
        {
            name: 'position',
            description: 'The queue position of the song to remove.',
            required: true,
            type: OptionTypes.NUMBER
        },
        {
            name: 'end',
            description: 'The queue position of the last song to remove.',
            type: OptionTypes.NUMBER
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;


        const { options } = i;
        const start = options.getNumber('position');
        const end = options.getNumber('end') || start;

        // start = 2, end = 2

        const player = bot.manager.get(i.member.guild.id);

        if (start < 1 || start > player.queue.length) {
            return reply.error('Invalid start position.');
        }
        if (end < 1 || end > player.queue.length) {
            return reply.error('Invalid end position.');
        }
        if (start > end) {
            return reply.error('Start position must be less than end position.');
        }

        logger.info(`Removing songs from ${start} to ${end} from queue.`);

        player.queue.remove(start - 1, end);
        reply(`Removed ${end + 1 - start} song(s) from queue.`);
    }
}