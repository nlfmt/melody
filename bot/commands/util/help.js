const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');
const pixelWidth = require('string-pixel-width');
const { commands } = require('../../handlers/commands');


const TYPES = {
    [OptionTypes.SUB_COMMAND]: '',
    [OptionTypes.SUB_COMMAND_GROUP]: 'cmd group',
    [OptionTypes.STRING]: 'string',
    [OptionTypes.INTEGER]: 'integer',
    [OptionTypes.BOOLEAN]: 'boolean',
    [OptionTypes.USER]: 'user',
    [OptionTypes.CHANNEL]: 'channel',
    [OptionTypes.ROLE]: 'role',
    [OptionTypes.MENTIONABLE]: 'mentionable',
    [OptionTypes.NUMBER]: 'number',
}


module.exports = {
    name: 'help',
    description: 'Shows information about available commands.',
    options: [
        {
            name: 'command',
            description: 'The command to show information about.',
            type: OptionTypes.STRING,
            required: false
        }
    ],

    run: async (i, reply) => {

        const command = i.options.getString('command');

        let title = '';
        let description = '';
        let footer = '';

        if (command) {
            const cmd = commands.filter(c => c.name === command)[0];
            if (!cmd) return reply.error(`Command '${command}' not found.`);
            footer = 'Options marked with * are required.';
            title = `Command: ${cmd.name}`;
            description = cmd.description + '\n\n';
            cmd.options.forEach(o => {
                description += `${TYPES[o.type]} **${o.name}**${o.required ? '*' : ''}: ${o.description}\n`;
                if (o.type == OptionTypes.SUB_COMMAND) {
                    o.options.forEach(so => {
                        description += ` - ${TYPES[so.type]} **${so.name}**: ${so.description}\n`;
                    });
                }
            });
        }
        else {
            let maxlen = 0;
            commands.forEach(c => {
                if (pixelWidth(c.name, { bold:true }) > maxlen) maxlen = pixelWidth(c.name, { bold:true });
            });
            maxlen = Math.round(maxlen * 0.8);
            title = 'Available commands';
            description = commands.map(cmd => `** ${cmd.name}**  ${'-'.repeat(Math.round((maxlen - 0.8 * pixelWidth(cmd.name, { bold:true })) / pixelWidth('-')) + 3)}  ${cmd.description}`).join('\n');
            footer = 'Type /help <command> to get more information about a specific command.';
        }

        reply(description, { ephemeral: true, title, footer: { text: footer } });

    }
}