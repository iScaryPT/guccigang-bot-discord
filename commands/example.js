module.exports = {
	name: 'example',
	description: 'Command design pattern.',
  args: '0',
  usage: ' ',
  aliases: '',
  guildOnly: false,
	async execute(message, args) {
		message.channel.send('example');
	}
};