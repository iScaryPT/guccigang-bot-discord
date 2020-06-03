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
 .on('finish', () => {
  serverQueue.songs.shift();
  module.exports.play(guild, serverQueue.songs.shift());
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
      "You have to be in a voice channel to stop the music!"
    );
  
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  
  serverQueue.connection.dispatcher.end();

}

module.exports.stop = async function (message) {
  
  const serverQueue = module.exports.queue.get(message.guild.id);
  
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  
  if (!serverQueue)
    return message.channel.send("There is no playlist that I could reset!");
  
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();

}

module.exports.getSongsList = async function (message) {
  
  const serverQueue = module.exports.queue.get(message.guild.id);
    
  if (!serverQueue)
    return message.channel.send("There is no playlist available!");
  
  return serverQueue.songs;

}

