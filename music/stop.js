const musicData = require('./data.js');

module.exports = {
	name: 'stop',
	description: 'Stops actual playlist.',
  args: '0',
  usage: ' ',
  aliases: '',
  guildOnly: true,
	async execute(message, args) {
    return await musicData.stop(message) ? 0 : message.channel.send("**\:white_check_mark: Playlist deleted!**");
	}
};