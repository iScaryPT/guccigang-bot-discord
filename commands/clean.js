module.exports = {
	name: 'clean',
	description: 'Our BIG ENTITY can vanish with a certain number of messages.',
  args: '1',
  usage: '<number>',
  aliases: ['limpar', 'cleanchat', 'clear'],
  guildOnly: true,
	async execute(message, args) {
		
    const deleteCount = parseInt(args[0], 10);
    
    if (!deleteCount || deleteCount < 1 || deleteCount > 99)
      return message.reply(
        "The number of messages must be between 1 and 99!"
      );

    const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1 });
    message.channel.bulkDelete(fetched);
    
    message.channel
    .send(`**${args[0]} messages vanished by our big entity!**`).then(msg => msg.delete({timeout: 5000}))
    .catch(error =>
      console.log(`Não foi possível deletar mensagens devido a: ${error}`)
    );
    
	}
};