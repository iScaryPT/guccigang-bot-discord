const express = require('express');
const fs = require('fs');
const { prefix }  = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos
const Discord = require("discord.js"); //Conexão com a livraria Discord.js

// Recebe solicitações que o deixa online
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); 



// guccibot
const client = new Discord.Client(); //Criação de um novo Client

// adiciona os comandos ao bot
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Ready");
  client.user.setActivity("Type &help");
})

client.on('message', message => {
  console.log(message);
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
  
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
	if (!command){ 
    message.channel.send(`Command not found! Say \`${prefix}help\` for a list of all available commands.`);
    return;
  }
  
  if (command.guildOnly && message.channel.type !== 'text') {
	  return message.reply('I can\'t execute that command inside DMs!');
  }
  
  if ((command.args != 'any') && (command.args != args.length)) {
		let reply =  `You didn't provide correctly the arguments, ${message.author}!`;
		reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
    return message.channel.send(reply);
  }
  
  try {
    
	  command.execute(message, args);
  
  } catch (error) {
	  console.error(error);
	  message.reply('there was an error trying to execute that command!');
  }
   
});


client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token 