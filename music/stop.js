const musicData = require('./data.js');

module.exports = {
	name: 'stop',
	description: 'Stops actual playlist.',
  args: '0',
  usage: ' ',
  aliases: '',
  guildOnly: true,
	async execute(message, args) {
    return musicData.stop(message) ? 0 : message.channel.send("Playlist deleted!");
	}
};