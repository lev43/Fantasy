const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  message.channel.send(`\`${message.author.username}:\` ${args[0]}`, 1000000)
}

module.exports.help = {
  name: "!",
  admin: true
}