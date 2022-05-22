const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');
const util = require('../../util/util');
const { bot } = require('../../index');

module.exports = {
    name: 'volume',
    description: 'Changes the volume of the music player.',
    options: [
        {
            name: 'value',
            description: 'The volume to set the music player to. (0-100)',
            type: OptionTypes.NUMBER,
            required: true
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const value = i.options.getNumber('value');
        const volume = Math.round(value / 2);

        const player = bot.manager.get(i.member.guild.id);

        if (player) {
            player.setVolume(volume);
            reply('Set the volume to **' + value + '**.');
        }
        else {
            reply.error('There is no music player running.');
        }
    }
}