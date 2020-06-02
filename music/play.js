const ytdl = require('ytdl-core');
const musicData = require('./data.js');

module.exports = {
	name: 'play',
	description: 'Add a music to the server queue.',
  args: '1',
  usage: '<music_link>',
  aliases: ['song'],
  guildOnly: true,
	async execute(message, args) {
		
    const voiceChannel = message.member.voiceChannel;
    
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    
    const songInfo = await ytdl.getInfo(args[0]);
    
    if(!songInfo) return message.channel.send('You need to provide a valid youtube link!');
    
    const song = {
       title: songInfo.title,
       url: songInfo.video_url,
    };
    
    const serverQueue = musicData.queue.get(message.guild.id);
    
    if(!serverQueue) {
      
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };
      
      musicData.queue.set(message.guild.id, queueContruct);
      queueContruct.songs.push(song);
      
      try {
 
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;

        play(message.guild, queueContruct.songs[0]);
        
      } catch (err) {

         console.log(err);
         musicData.queue.delete(message.guild.id);
         return message.channel.send(err);
      }
      
    } else {
      
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      return message.channel.send(`${song.title} has been added to the queue!`);
      
    }
    
	}
};