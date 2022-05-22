const { bot } = require('../../index');
const util = require('../../util/util');

module.exports = {
    name: 'stop',
    description: 'Stops the player and quits the voice channel.',
    options: [],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);
        if (!player) return reply.warn('There is no music playing');

        player.destroy();
        reply('Stopped the music.');
    }
}