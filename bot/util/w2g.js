const { w2g_api_key } = require('../config.json');
const logger = require('./logger');


async function createRoom(vid_url) {
    if (!w2g_api_key) {
        logger.error('Missing w2g_api_key in config.json');
        return;
    }
    const res = await fetch('https://w2g.tv/rooms/create.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            w2g_api_key,
            share: vid_url || '',
            bg_color: '#404040',
            bg_opacity: '100',
        }),
    }).then(r => r.json());

    if (res.streamkey == null) return '';

    return 'https://w2g.tv/rooms/' + res.streamkey;
}

module.exports = { createRoom };