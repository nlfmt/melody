const { bot } = require('../../index');
const logger = require('../../util/logger');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');


module.exports = {
    name: 'play',
    description: 'Play a song.',
    options: [
        {
            name: 'song',
            type: OptionTypes.STRING,
            description: 'The name/url of the song to play.',
            required: true
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const { options, member } = i;
        const song = options?.getString('song');

        if (!song) return reply.warn('Please provide a song to play.');

        let player = bot.manager.get(member.guild.id);

        // Resume if paused
        if (player && !song) {
            if (player.state !== 'CONNECTED') {
                return reply.warn('I\'m not connected to a voice channel.');
            }
            else if (player.paused) {
                player.pause(false);
                return reply('Resumed playing.');
            }
            else {
                return reply.warn('I need a song name to start playing.');
            }
        }

        // Check if user is in a voice channel
        if (!member.voice.channel) return reply.warn('You need to be in a voice channel to use this command.');


        // Check for existing player
        if (player && player?.voiceChannel !== member.voice.channel.id) {
            return reply.error('I am already playing in a different channel.');
        }

        await i.deferReply('Searching...');

        try {
            if (!player) {
                player = bot.manager.create({
                    guild: member.guild.id,
                    voiceChannel: member.voice.channel.id,
                    textChannel: i.channel.id,
                    selfDeafen: true,
                    volume: 50
                });
            }

            const queue = player.queue;

            if (player.state !== 'CONNECTED') player.connect();

            const result = await player.search(song, i.member);
            if (result.loadType === 'LOAD_FAILED') {
                if (!queue.current) {
                    player.destroy();
                    logger.error('Song Search', result.exception.message || result.exception);
                    return reply.error('No results found.');
                }
            }

            switch (result.loadType) {

                case 'NO_MATCHES':
                    reply.error('No results found.');
                    break;

                case 'PLAYLIST_LOADED':
                    queue.add(result.tracks);
                    if (!player.playing) await player.play();
                    reply(`Added **${result.tracks.length}** songs from **[${result.playlist.name}](${song})** to the queue.`);
                    break;

                default:
                    // eslint-disable-next-line no-case-declarations
                    const track = result.tracks[0];
                    queue.add(track);

                    if (player.paused) await player.pause(false);
                    else if (!player.playing) await player.play();

                    return reply(`Added **${track.title}** to the queue.`);
            }

        }
        catch (err) {
            reply.error('Something went wrong.')
            return logger.error('Command: Play', err?.stack || err);
        }
    }
}