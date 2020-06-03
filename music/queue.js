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
      return message.channel.send("Wrong queue index!");
    
    var page = args[0] ? args[0] : 1;
    var list =  await musicData.getSongsList(message);
	  var res = '';
    var availablePages = Math.ceil(list.length/20);
    
    if(page > availablePages)
      return message.channel.send("Invalid queue page!")
    
    for(let i = (page-1)*20; i < (page*20); i++){
      if(i >= list.length)
        break;
      res += list[i].title + "\n";
    }
        
    if(!res) res = 'Empty queue page' + "\n";
    
    res += "\n" + `[Page ${page}\\${availablePages}]`;
    res += availablePages > 1 ? "\n\n" + "If you want to access other pages type \`&queue <number_page>\`!" : '';
    
    message.channel.send(res);
  }
  
};