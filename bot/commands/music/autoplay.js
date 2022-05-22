const { bot } = require('../../index');
const util = require('../../util/util');

module.exports = {
    name: 'autoplay',
    description: 'Automatically plays related songs when the queue is empty.',

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);

        if (!player) return reply.warn('There is no music playing.');

        player.set('autoplay', !player.get('autoplay'));

        reply(`Turned autoplay **${player.get('autoplay') ? 'on' : 'off'}**.`);
    }
}