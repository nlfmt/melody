const { bot } = require('../../index');
const util = require('../../util/util');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the queue.',

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);

        if (player.queue.length == 0) return reply.error('There are no songs in the queue.');

        player.queue.shuffle();

        reply('Shuffled the queue.');
    }
}