const { bot } = require('../../index');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'songinfo',
    description: 'Displays info about the current song.',
    options: [
        {
            name: 'position',
            description: 'The position of the song in the queue.',
            type: OptionTypes.NUMBER
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);
        if (!player) return reply.warn('There is no music playing');

        const position = i.options?.getNumber('position') || 0;
        if (position < 0 || position > player.queue.size) return reply.warn('The queue only has ' + player.queue.size + ' songs.');

        const song = [player.queue.current, ...player.queue][position];

        await i.reply('Getting song data...');
        await song.resolve?.();


        await i.editReply({
            content: null,
            embeds: [{
                thumbnail: {
                    url: song.thumbnail
                },
                description: `\n**[${song.title}](${song.uri})**\nby ${song.author}\n\n**Length:** \`${util.duration(song.duration / 1000)}\`\n**Requested by:** ${song.requester}`,
            }]
        })
    }
}