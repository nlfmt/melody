const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');


module.exports = {
    name: 'lyrics',
    description: 'Gets the lyrics of a song.',
    options: [
        {
            name: 'search_term',
            description: 'Preferably the song\'s name and artist',
            type: OptionTypes.STRING,
            required: true
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const searchTerm = i.options.getString('search_term');

        await i.deferReply('Searching...');

        const json = await fetch('https://api.lyrics.ovh/suggest/' + searchTerm.normalize('NFD'))
            .then(res => res.json());

        const artist = json.data[0].artist.name;
        const track = json.data[0].title;

        if (!artist || !track) return reply.warn('Can\'t find lyrics for this song.');

        fetch('https://api.lyrics.ovh/v1/' + artist + '/' + track)
            .then(res => res.json())
            .then(data => {
                let { lyrics } = data;
                if (!lyrics) return reply.warn('Can\'t find lyrics for this song.');
                lyrics = lyrics
                    .replaceAll('\r', '')
                    .replace(/Paroles de la.*\n/gm, '')
                    .replaceAll('\n\n\n', '\n\n')
                    .replaceAll('´', '\'')
                    .replaceAll('`', '\'');
                reply(lyrics, { title: 'Lyrics for ' + track + ' by ' + artist });
            }
        );
    }
}