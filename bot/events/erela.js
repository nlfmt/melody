const logger = require('../util/logger');
const util = require('../util/util');

let timeoutID = null;

function setup(bot) {
    const { manager } = bot;

    manager.on('nodeConnect', (node) => logger.info(`Lavalink Node ${node.options.identifier} connected`));
    manager.on('nodeDisconnect', (node) => logger.info(`Node ${node.options.identifier} disconnected`));
    manager.on('nodeError', (node, error) => logger.error(`Node ${node.options.identifier}`, error));

    manager.on('trackStart', (player, track) => {
        const guild = bot.guilds.cache.get(player.guild);

        util.sendNowPlaying(guild, player);

        logger.info(`[${guild.name}] Now playing: ${track.title}`);
    });

    manager.on('playerCreate', player => {
        player.set('playedSongs', []);
        player.set('autoplay', false);
        player.set('repeatMode', 0);
        player.set('fPrev', false);
    });

    function addToPlayedSongs(player, song) {
        const played = player.get('playedSongs');
        if (played.slice(-1) !== song) played.push(song);
        player.set('playedSongs', played);
    }

    manager.on('trackStart', () => clearTimeout(timeoutID));

    manager.on('trackEnd', (player, track) => {
        if (!player.get('fPrev')) addToPlayedSongs(player, track);
        else player.set('fPrev', false);

        util.deleteNowPlaying(player.guild);
    });

    manager.on('queueEnd', async (player, song) => {
        const guild = bot.guilds.cache.get(player.guild);

        addToPlayedSongs(player, song);
        await util.deleteNowPlaying(player.guild);

        if (!player.get('autoplay')) {
            // Wait a minute before destroying the player.
            timeoutID = setTimeout(() => player.destroy(), 60_000);
            return;
        }

        const mixURL = `https://youtube.com/watch?v=${song.identifier}&list=RD${song.identifier}`;
        const res = await player.search(mixURL, bot.user);

        if (!res || res.loadType === 'LOAD_FAILED' || res.loadType !== 'PLAYLIST_LOADED') {
            guild.channels.cache.get(player.textChannel)
                .send('Couldn\'t find any similar songs.');
            return player.destroy();
        }

        let newSong = null;
        const playedSongs = player.get('playedSongs');

        for (const track of res.tracks) {
            if (!playedSongs.find(t => t.title === track.title)) {
                newSong = track;
                break;
            }
        }

        if (!newSong) {
            guild.channels.cache.get(player.textChannel)
                .send('Couldn\'t find any similar songs.');
            return player.destroy();
        }

        player.queue.add(newSong);
        return player.play();

    });

    manager.on('playerMove', player => {
        const guild = bot.guilds.cache.get(player.guild);
        logger.info(`[${guild.name}] Player moved`);
    })


}

module.exports = { setup };