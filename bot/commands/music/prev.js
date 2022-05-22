const { bot } = require('../../index');
const util = require('../../util/util');


module.exports = {
    name: 'prev',
    description: 'Plays the previous song again.',

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);

        const playedSongs = player.get('playedSongs');
        const [prevTrack] = playedSongs.slice(-1);
        if (!prevTrack) return reply.error('There is no previous song.');

        player.set('playedSongs', playedSongs.slice(0, -1));
        player.queue.add(player.queue.current, 0);
        player.queue.add(prevTrack, 0);
        player.set('fPrev', true);
        player.stop();

        reply(`Playing \`${prevTrack.title}\` again.`);
    }
}