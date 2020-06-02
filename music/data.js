const ytdl = require('ytdl-core');

// map (server/guild->queue)
const queue = new Map();

const play = function (guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  
  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
 .on('end', () => {
  console.log('Music ended!');
  // Deletes the finished song from the queue
  serverQueue.songs.shift();
  // Calls the play function again with the next song
  play(guild, serverQueue.songs[0]);
})
 .on('error', error => {
  console.error(error);
 });
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
}