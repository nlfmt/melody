const { bot } = require('../../index');
const util = require('../../util/util');

module.exports = {
    name: 'info',
    description: 'Shows basic information about the bot.',

    run: async interaction => {

        interaction.reply({
            embeds: [{
                title: `${bot.user.username}#${bot.user.discriminator}`,
                description: 'A Bot that can play music and moderates the server.',
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Uptime',
                        value: util.code(util.duration(process.uptime()))
                    },
                    {
                        name: 'Memory Usage',
                        value: util.code(`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                    },
                    {
                        name: 'Server Count',
                        value: util.code(bot.guilds.cache.size)
                    },
                    {
                        name: 'Made by',
                        value: bot.config.admins.map(id => `<@${id}>`).join(' ')
                    },
                ]
            }]
        });
    }
}