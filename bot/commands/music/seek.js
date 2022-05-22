const { bot } = require('../../index');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Seek to the specified time in the song.',
    options: [
        {
            name: 'time',
            description: 'The time to seek to. (X:XX)',
            type: OptionTypes.STRING,
            required: true
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const time = i.options.getString('time');
        const player = bot.manager.get(i.member.guild.id);

        if (!player.queue.current.isSeekable) return reply.error('Song is not seekable.');

        try {

            let millis = 0;
            const parts = time.split(':');
            millis += Number(parts[0]) * 60000;
            if (parts.length > 1) millis += Number(parts[1]) * 1000;

            player.seek(millis);
            return reply(`Seeked to **${time.includes(':') ? time : time + ':00'}**`);

        }
        catch (e) {
            return reply.error('Invalid time format.');
        }
    }
}