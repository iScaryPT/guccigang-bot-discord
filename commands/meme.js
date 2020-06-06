const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

module.exports = {
	name: 'meme',
	description: 'Send a random meme from a random sub reddit.',
  args: '0',
  usage: ' ',
  aliases: '',
  guildOnly: true,
	async execute(message, args) {
		
    const subReddits = [ "dankmeme", "meme"];
    const randomChoice = subReddits[Math.floor(Math.random() * subReddits.length)];
    
    const img = await randomPuppy(randomChoice);
    
    const embed = new Discord.MessageEmbed()
                  .setColor('RANDOM')
                  .setImage(img);
    
    message.channel.send(embed);
    
	}
};