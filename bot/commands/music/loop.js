const { bot } = require('../../index');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'Loop a song or the queue.',
    options: [
        {
            name: 'mode',
            required: true,
            type: OptionTypes.STRING,
            description: 'The mode to loop the queue in.',
            choices: [
                {
                    name: 'Off',
                    value: 'off'
                },
                {
                    name: 'Song',
                    value: 'song'
                },
                {
                    name: 'Queue',
                    value: 'queue'
                }
            ]
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const mode = i.options.getString('mode')
        const player = bot.manager.get(i.member.guild.id);

        if (!player) return reply.warn('There is no music playing.');

        switch (mode) {
            case 'song':
                player.set('repeatMode', 1);
                player.setTrackRepeat(true);
                player.setQueueRepeat(false);
                break;

            case 'queue':
                player.set('repeatMode', 2);
                player.setTrackRepeat(false);
                player.setQueueRepeat(true);
                break;

            case 'off':
                player.set('repeatMode', 0);
                player.setTrackRepeat(false);
                player.setQueueRepeat(false);
                break;

            default:
                return reply.error('Invalid loop mode.');
        }

        reply(`Set loop mode to **${mode}**.`);
    }
}