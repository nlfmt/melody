const { bot } = require('../../index');
const util = require('../../util/util');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Displays the current queue.',
    options: [
        {
            name: 'page',
            type: OptionTypes.NUMBER,
            description: 'The page to display.',
        }
    ],

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;

        const player = bot.manager.get(i.member.guild.id);
        if (!player) return reply.warn('There is no music playing');

        const page = i.options.getNumber('page') || 1;
        const maxPage = Math.ceil(player.queue.totalSize / 10);

        if (page > maxPage) return reply.warn(`Page ${page} does not exist, there ${maxPage == 1 ? 'is' : 'are'} only ${maxPage} page${maxPage == 1 ? '' : 's'}.`);

        const tracksToShow = [player.queue.current, ...player.queue].slice(10 * (page - 1), 10 * page);
        const rickroll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        await i.reply('Getting song data...');
        for (const track of tracksToShow) {
            if (track.resolve) await track.resolve();
        }
        const description = tracksToShow.map((song, index) => {
            let label = (page == 1 ? (index == 0 ? '▸' : index) : 10 * (page - 1) + index + 1);
            if (page != 1 || index != 0) label += ':';

            let title = song.title;
            // filter out unnecessary info enclosed in brackets
            // eslint-disable-next-line no-useless-escape
            title = title.replace(/([\S\s]{3})[\[\(].*[\]\)][\s\S]*$/, '$1');
            // filter out features (u2013 is an alternative to - )
            title = title.replace(/\s(feat\.|ft\.)[^\u002d\u2013]*/i, ' ').trim();
            // filter out artists
            const split = title.split(/ \u002d|\u2013 /);
            if (title.length < 3) title = song.title;
            if (split.length > 1 && split.length < 3) {
                const regex = new RegExp(`${song.author}`, 'i');
                if (split[0].search(regex) != -1) {
                    title = split[1];
                }
                else if (split[1].search(regex) != -1) {
                    title = split[0];
                }
            }

            return `${label} [**${title}** - ${song.author}](${song.uri || rickroll})`;
        }).join('\n');

        await i.editReply({
            content: null,
            embeds: [{
                title: player.queue.totalSize + ' songs, ' + util.duration(player.queue.duration / 1000) + ' playtime',
                description,
                footer: {
                    text: 'Page  ' + page + '  of  ' + maxPage
                }
            }]
        })
    }
}