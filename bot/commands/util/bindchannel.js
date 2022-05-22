const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');
const logger = require('../../util/logger');
const { bot } = require('../../index');
const db = require('../../util/db');

module.exports = {
    name: 'bindchannel',
    description: 'Bind the bot to a voice or text channel.',
    options: [
        {
            name: 'add',
            type: OptionTypes.SUB_COMMAND,
            description: 'Bind a channel.',
            options: [
                {
                    name: 'channel',
                    required: true,
                    type: OptionTypes.CHANNEL,
                    description: 'The target channel.',
                }
            ]
        },
        {
            name: 'remove',
            type: OptionTypes.SUB_COMMAND,
            description: 'Unbind a channel.',
            options: [
                {
                    name: 'channel',
                    required: true,
                    type: OptionTypes.CHANNEL,
                    description: 'The target channel.',
                }
            ]
        },
        {
            name: 'clear',
            type: OptionTypes.SUB_COMMAND,
            description: 'Clear all bound channels.',
            options: []
        },
        {
            name: 'list',
            type: OptionTypes.SUB_COMMAND,
            description: 'List all bound channels.',
            options: []
        }
    ],

    run: async (i, reply) => {

        if (!bot.config?.support?.includes(i.user.id)) {
            return reply.error('You are not authorized to use this command.');
        }

        const action = i.options.getSubcommand();
        const channel = i.options.getChannel('channel');
        if (channel?.type === 'GUILD_CATEGORY') return reply.error('Categories can\'t be bound.');
        const id = channel?.id;


        const data = db.get();
        let ids;
        ids = data?.guildOptions?.[i.member.guild.id]?.channels || [];

        switch (action) {
            case 'add':
                if (ids.includes(id)) return reply.warn('This channel is already bound.');
                ids.push(id);
                logger.info(`Binding channel ${id} in guild '${i.member.guild.name}'`);
                break;
            case 'remove':
                ids = ids.filter(x => x !== id);
                logger.info(`Unbinding channel ${id} in guild '${i.member.guild.name}'`);
                break;
            case 'clear':
                logger.info(`Clearing bound channels in guild '${i.member.guild.name}'`);
                ids = [];
                break;
            case 'list':
                if (ids.length == 0) return reply('No channels are bound.');
                return reply(`Bound channels: ${ids.map(_id => `<#${_id}>`).join(', ')}`, { ephemeral: true });
        }

        db.update({
            guildOptions: {
                [i.member.guild.id]: {
                    channels: ids
                }
            }
        });

        switch (action) {
            case 'add': return reply(`Successfully bound to channel <#${id}>.`, { ephemeral: true, color: 0x22FF22 });
            case 'remove': return reply(`Successfully unbound channel <#${id}>.`, { ephemeral: true, color: 0x22FF22 });
            case 'clear': return reply('Successfully cleared channels.', { ephemeral: true, color: 0x22FF22 });
        }
    }
}