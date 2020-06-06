const musicData = require('./data.js');
const Discord = require('discord.js');


module.exports = {
	name: 'queue',
	description: 'Shows actual playlist',
  args: 'any',
  usage: ' ',
  aliases: ['playlist','musics'],
  guildOnly: true,
	async execute(message, args) {
    
    if(args.length > 1)
      return message.channel.send("**\:x: Wrong queue page!**");
    
    var page = args[0] ? args[0] : 1;

   
    if(page <= 0)
      return message.channel.send("**\:x: Wrong queue page!**");


    var list =  await musicData.getSongsList(message);
    
    if(!(list.length)) return message.channel.send("**\:x: There is no playlist available!**");

	  var res = '';
    var availablePages = Math.ceil(list.length/10);
    
    if(page > availablePages)
      return message.channel.send("**\:x: Invalid queue page!**");

    
    res += "\n\n **Right Now:**\n"
    res += `[${list[0].title}](${list[0].url}) | \`By: ${list[0].user}\``;
    
    res += list.length > 1 ? "\n\n **Up Next:**\n" : '\n\n';
    
    for(let i = (page-1)*10; i < (page*10); i++){
      if(i >= list.length)
        break;
      if(i == 0)
        continue;
      res += `\`${i}.\` [${list[i].title}](${list[i].url}) | \`By: ${list[i].user}\`\n\n`;
    }
    
    res += `**${list.length-1} songs enqueued!**`;
  
    
    

      let footer = '';
      footer += `Page ${page}\\${availablePages}`;
      footer += availablePages > 1 ? "      If you want to access other pages type \`&queue <number_page>\`!" : '';

      console.log(message.member);  
    
      const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('GucciGang Music Queue')
          .setDescription(res)
          .setFooter(footer, message.member.user.displayAvatarURL());



    message.channel.send(embed);
  }
  
};