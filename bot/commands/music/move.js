const { bot } = require('../../index');
const logger = require('../../util/logger');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'move',
    description: 'Move a song to a different position in the queue.',
    options: [
        {
            name: 'song_pos',
            description: 'The current position of the track to move.',
            type: OptionTypes.NUMBER,
            required: true
        },
        {
            name: 'new_pos',
            description: 'The new position the track should be moved to.',
            type: OptionTypes.NUMBER,
            required: true
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const { options } = i;
        const songPosition = options.getNumber('song_pos');
        const newPosition = options.getNumber('new_pos');

        // start = 2, end = 2

        const player = bot.manager.get(i.member.guild.id);
        if (songPosition == newPosition) return reply.error('bruh why');

        if (songPosition < 1 || songPosition > player.queue.length) {
            return reply.error('Invalid song position.');
        }
        if (newPosition < 1 || newPosition > player.queue.length) {
            return reply.error('Invalid new position.');
        }

        logger.info(`Moving song from ${songPosition} to ${newPosition} in queue.`);

        const track = player.queue.remove(songPosition - 1);
        player.queue.add(track, newPosition - 1);

        reply(`Moved song from position ${songPosition} to position ${newPosition}.`);
    }
}