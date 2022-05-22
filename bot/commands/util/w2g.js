const { MessageActionRow, MessageButton } = require('discord.js');
const { Constants: { ApplicationCommandOptionTypes: OptionTypes } } = require('discord.js');
const logger = require('../../util/logger');
const { createRoom } = require('../../util/w2g');

module.exports = {
    name: 'w2g',
    description: 'Create a Watch2Gether room.',
    options: [
        {
            name: 'url',
            type: OptionTypes.STRING,
            description: 'The video url to play in the new room.',
        }
    ],

    run: async (i, reply) => {

        const vid_url = i.options.getString('url');

        const url = await createRoom(vid_url);

        if (url == '') {
            logger.error(`Failed to create room with video url ${vid_url}.`);
            return reply.error('Failed to create room.');
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Open Room!')
                    .setStyle('LINK')
                    .setURL(url)
        );
        
        logger.info('Created room: ' + url);

        i.reply({
            components: [row]
        });
    }
}