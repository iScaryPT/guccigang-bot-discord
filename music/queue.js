const musicData = require('./data.js');

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

    if(page < 0)
      return message.channel.send("**\:x: Wrong queue page!**");


      var list =  await musicData.getSongsList(message);
	  var res = '';
    var availablePages = Math.ceil(list.length/20);
    
    if(page > availablePages)
      return message.channel.send("**\:x: Invalid queue page!**");

    for(let i = (page-1)*20; i < (page*20); i++){
      if(i >= list.length)
        break;
      res += `\`${i}.\` [${list[i].title}](${list[i].url}) \`(${makeTime(list[i].duration)})\` | \`By: ${list[i].user}\`\n\n`;
    }
        
    if(!res)  return message.channel.send("**\:x: There's no songs enqueued!**");

      let footer = '';
      footer += `Page ${page}\\${availablePages}`;
      footer += availablePages > 1 ? "\n\n" + "If you want to access other pages type \`&queue <number_page>\`!" : '';


      const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('GucciGang Music Queue')
          .setURL('https://http://gucci-disc-bot.glitch.me/')
          .addFields(
              { name: '**Up Next:**', value: res },
          )
          .setFooter(footer);


    message.channel.send(embed);
  }
  
};