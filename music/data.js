const ytdl = require('ytdl-core');

// map (server/guild->queue)
module.exports.queue = new Map();

module.exports.play = async function (guild, song) {
  const serverQueue = module.exports.queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    module.exports.queue.delete(guild.id);
    return;
  }
  
  const dispatcher = serverQueue.connection.play(ytdl(song.url))
 .on('start', () => {
   serverQueue.textChannel.send(`**Playing** \:notes: \`${song.title}\` ** now! Requested by** \`${song.user}\``);
 })
 .on('finish', () => {
  serverQueue.songs.shift();
  module.exports.play(guild, serverQueue.songs[0]);
})
 .on('error', error => {
  console.error(error);
 });
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
}


module.exports.skip = async function (message) {
  
  const serverQueue = module.exports.queue.get(message.guild.id);
  
  if (!message.member.voice.channel)
    return message.channel.send(
      "**\:x: You have to be in a voice channel to skip a music!**"
    );
  
  if (!serverQueue)
    return message.channel.send("**\:x: There's no song that I could skip fag!**");
  
  serverQueue.connection.dispatcher.end();

}

module.exports.stop = async function (message) {
  
  const serverQueue = module.exports.queue.get(message.guild.id);
  
  if (!message.member.voice.channel)
    return message.channel.send(
      "**\:x: You have to be in a voice channel to stop the music!**"
    );
  
  if (!serverQueue)
    return message.channel.send("**\:x: There's no music playing fag!**");
  
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();

}

module.exports.getSongsList = async function (message) {
  
  const serverQueue = module.exports.queue.get(message.guild.id);
    

  if (!serverQueue){
    return [];
  }

  return serverQueue.songs;

}

