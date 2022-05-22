const { bot } = require('../../index');
const util = require('../../util/util');


module.exports = {
    name: 'clear',
    description: 'Deletes all songs in the queue.',

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);

        if (!player) return reply.warn('There is no music playing.');
        if (player.queue.size == 0) return reply.warn('There are no songs in the queue.');

        player.queue.clear();

        reply('Cleared the queue.');
    }
}