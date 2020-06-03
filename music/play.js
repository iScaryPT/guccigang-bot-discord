const ytdl = require('ytdl-core');
const musicData = require('./data.js');
//const YouTube = require("discord-youtube-api");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyADVSSXCWzeTn3jTRJw5jSFoKpEf_wMZK4");
const fetch = require('node-fetch');

const key = "AIzaSyADVSSXCWzeTn3jTRJw5jSFoKpEf_wMZK4";
const base = "https://www.googleapis.com/youtube/v3";





module.exports = {
	name: 'play',
	description: 'Add a music to the server queue.',
  args: 'any',
  usage: '<music_link>',
  aliases: ['song'],
  guildOnly: true,
	async execute(message, args) {
	  
    if(!args.length){
      return message.channel.send('Please enter a valid youtube url/playlist or keyword(s).');
    }
    
    var songsList = [];
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    
    try {
     
      //verifica se tem ID de vídeo, se não tiver assume-se que é playlist
      if(await ytdl.validateURL(args[0])) {
        
        const videoID = await ytdl.getURLVideoID(args[0]);
        
        //se tiver ID adiciona o song correspondente a lista de sons
        const video = await youtube.getVideoByID(videoID);
    
        songsList.push({
            title: video.title,
              url: `https://www.youtube.com/watch?v=${video.id}`,
        });
        
        // verifica se tem playlist -> list?=...
        var reg = new RegExp("[&?]list=([^&]+)","i");
        var match = reg.exec(args[0]);
      
        // se tiver adiciona todos os sons da list á queue
        if(match){
           const playlist = await youtube.getPlaylistByID(match[1]);
           const playlistVideos = await playlist.getVideos();
          
          //remove o primeiro pois ja esta a tocar
          playlistVideos.shift();
          
          playlistVideos.forEach((video) => {
            songsList.push({
            title: video.title,
              url: `https://www.youtube.com/watch?v=${video.id}`,
            });
          });
        }
      
      } else {
      
        // se nao tiver id watch?=... é porque é uma playlist ou então keywords for search
      
        // verifica se tem playlist -> list?=...
        var reg = new RegExp("[&?]list=([^&]+)","i");
        var match = reg.exec(args[0]);
      
        // se tiver adiciona todos os sons da list á queue
        if(match){
          const playlist = await youtube.getPlaylistByID(match[1]);
          const playlistVideos = await playlist.getVideos();
          playlistVideos.forEach((video) => {
            songsList.push({
              title: video.title,
              url: `https://www.youtube.com/watch?v=${video.id}`,
            });
          });
        } else {
        
          // entao se chegar aqui e porque são keywords...
             
          const searchQuery = args.slice(0).join(" ");
          const searchedVideo =  await youtube.searchVideos(searchQuery,1);
        
          songsList.push({
              title: searchedVideo[0].title,
              url: `https://www.youtube.com/watch?v=${searchedVideo[0].id}`,
          });
        
        }
      
      }
      
    } catch (err)  {
      
      console.log(err)
      return message.channel.send("Song not found dude...");
      
    }
   
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
      
     
      songsList.forEach((song) => {
        queueContruct.songs.push(song);
      });
      
      try {
 
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;  
        musicData.play(message.guild, queueContruct.songs.shift());
        
        if(songsList.length-1)
          return message.channel.send(`${songsList.length-1} songs have been added to the queue!`);
        
      } catch (err) {

         console.log(err);
         musicData.queue.delete(message.guild.id);
         return message.channel.send(err);
      }
      
    } else {
      
       songsList.forEach((song) => {
         serverQueue.songs.push(song);
      });
 
       return message.channel.send(`${songsList.length} songs have been added to the queue!`);
      
    }
    
    
    
	}
};

