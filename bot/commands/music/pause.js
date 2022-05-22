const { bot } = require('../../index.js');
const util = require('../../util/util');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pause/Resume the current Song.',

    run: async (i, reply) => {
        if (!util.checkTextChannel(i)) return;
        if (!util.checkVoiceChannel(i)) return;

        const { member: { guild } } = i;
        const player = bot.manager.get(guild.id);

        if (player) {
            if (i.isButton()) {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('prev')
                            .setLabel('Prev')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('pause')
                            .setLabel(player.paused ? 'Pause' : 'Resume')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('skip')
                            .setLabel('Next')
                            .setStyle('SECONDARY'),
                    )

                i.message.edit({ components: [row] });
            }
            if (player.paused) {
                player.pause(false);
                return reply('The player has been resumed');
            }
            player.pause(true);
            reply('The player has been paused.');
        }
        else {
            reply.warn('There is no music playing.');
        }
    }
}