const { MessageActionRow, MessageButton } = require('discord.js');
const db = require('./db');

const nowplaying_msgs = {};

// this function takes a number of seconds and returns a duration string
function duration(s) {
    s = Math.round(s);
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;
    return (h > 0 ? `${h}h ` : '')
         + (m > 0 ? `${m}m ` : '')
         + `${s}s`;
}

function code(msg) {
    return `\`\`\`${msg}\`\`\``;
}

async function deleteNowPlaying(guild) {
    const msg = nowplaying_msgs[guild];
    if (msg) {
        await msg.delete();
        nowplaying_msgs[guild] = null;
    }
}

async function sendNowPlaying(guild, player) {
    const channel = guild.channels.cache.get(player.textChannel);
    const track = player.queue.current;

    let title = track.title;
    // filter out artists
    const split = title.split(/ \u002d|\u2013 /);
    if (split.length > 1 && split.length < 3) {
        const regex = new RegExp(`${track.author}`, 'i');
        if (split[0].search(regex) != -1) {
            title = split[1];
        }
        else if (split[1].search(regex) != -1) {
            title = split[0];
        }
    }

    const embed = {
        title: 'Now playing:',
        description: `[${title}](${track.uri})\nby ${track.author}`,
        thumbnail: {
            url: track.thumbnail
        },
        color: 0xe6e6e6
    }

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('Prev')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('skip')
                .setLabel('Next')
                .setStyle('SECONDARY'),
        )
    nowplaying_msgs[guild.id] = await channel.send({ embeds: [embed], components: [row] });
}


function replyEmbed(int, msg, opts) {

    opts = opts || {};

    if (int.replied || int.deferred) {
        return int.editReply({
            embeds: [getMessageEmbed(msg, opts)],
        })
    }
    else {
        return int.reply({
            embeds: [getMessageEmbed(msg, opts)],
            ephemeral: 'ephemeral' in opts ? opts.ephemeral : true,
        });
    }

}

function replyWarn(int, msg, opts) {
    replyEmbed(int, msg, { ...opts, color: 0xFF8F30, ephemeral:true });
}

function replyError(int, msg, opts) {
    replyEmbed(int, msg, { ...opts, color: 0xE25D50, ephemeral:true });
}

function getMessageEmbed(msg, opts) {

    return {
        title: opts?.title,
        color: opts?.color,
        description: msg,
        timestamp: opts?.timestamp ? new Date() : false,

        fields: opts?.fields ? opts?.fields : [],
        footer: opts?.footer
    }
}

function getBoundChannels(guildId) {
    const data = db.get();
    const guildOpts = data?.guildOptions?.[guildId];
    if (!guildOpts) return [];

    const channels = guildOpts.channels;
    return channels ? channels : [];
}

function checkTextChannel(i) {
    const channels = getBoundChannels(i.member.guild.id).filter(id => i.member.guild.channels.cache.get(id).isText());
    if (channels.length === 0) return true;

    if (!channels.includes(i.channelId)) {
        replyEmbed(i, '**Please use one of these channels for music commands:**\n\n' + channels.map(id => `<#${id}>`).join(', '), { ephemeral: true });
        return false;
    }
    return true;
}

function checkVoiceChannel(i) {
    const channels = getBoundChannels(i.member.guild.id).filter(id => i.member.guild.channels.cache.get(id).isVoice());
    if (channels.length === 0) return true;

    if (!channels.includes(i.member.voice.channelId)) {
        replyEmbed(i, '**Please use one of these voice channels for music:**\n\n' + channels.map(id => `<#${id}>`).join(', '), { ephemeral: true });
        return false;
    }
    return true;
}

module.exports = {
    duration,
    code,
    replyEmbed,
    replyWarn,
    replyError,
    getMessageEmbed,
    sendNowPlaying,
    deleteNowPlaying,
    nowplaying_msgs,
    checkTextChannel,
    checkVoiceChannel,
};