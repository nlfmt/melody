# Melody - A simple to use music bot for discord

## Features
- Play music from youtube
- Play music from spotify links
- Easy to use music control buttons in discord
- Slash command infrastructure
- Dedicated channels for commands
- Advanced queue control
- Lyrics search
- Song seeking
- Creating Watch2Gether rooms

![melody-screenshot](https://user-images.githubusercontent.com/71983360/169713398-4b1f91a9-bb32-463b-a4f2-d09baf6934ba.png)

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Fill in the config.json file
    - you need a [discord developer account](https://discord.com/login?redirect_to=%2Fdevelopers) and a discord application.
    - you need a [spotify developer account](https://developer.spotify.com/dashboard/applications).
    - optionally you need a [Watch2Gether](https://w2g.tv/auth/sign_up) account.
4. Register all slash commands to your application with `npm run register`
5. Run the bot with `npm start`

## Commands
| Name        | Description 
|-------------|--------------
| autoplay    | Automatically plays related songs when the queue is empty.
| clear       | Deletes all songs in the queue.
| loop        | Loop a song or the queue.
| lyrics      | Gets the lyrics of a song.
| move        | Move a song to a different position in the queue.
| next        | Plays the next song in the queue.
| pause       | Pause/Resume the current Song.
| play        | Play a song.
| prev        | Plays the previous song again.
| queue       | Displays the current queue.
| remove      | Removes a song from the queue.
| seek        | Seek to the specified time in the song.
| shuffle     | Shuffles the queue.
| songinfo    | Displays info about the current song.
| stop        | Stops the player and quits the voice channel.
| volume      | Changes the volume of the music player.
| bindchannel | Bind the bot to a voice or text channel.
| help        | Shows information about available commands.
| info        | Shows basic information about the bot.
| w2g         | Create a Watch2Gether room.

## Credits
Thanks to [L0SER8228](https://github.com/L0SER8228) for giving me a great starting point and great ideas for the bot.

## License
This software is licensed under the MIT license. More information can be found in the LICENSE file.
