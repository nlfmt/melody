const { bot } = require('../../index');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'next',
    aliases: ['skip'],
    description: 'Plays the next song in the queue.',
    options: [
        {
            name: 'position',
            description: 'The queue position of the song to skip to.',
            type: OptionTypes.NUMBER
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const position = i.options?.getNumber('position');
        const player = bot.manager.get(i.member.guild.id);

        if (!player) return reply.warn('There is no music playing.');

        if (position) {
            if (position < 1) return reply.warn('Invalid position.');
            if (position > player.queue.size) return reply.warn('The queue only has ' + player.queue.length + ' songs.');

            if (position != 1) player.queue.remove(0, position - 1);
        }

        player.stop();
        reply('Skipped the song.');
    }
}