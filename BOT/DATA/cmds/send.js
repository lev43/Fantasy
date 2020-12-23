const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  global.send(message, `\`${message.author.username}:\` ${args[0]}`, 1000000)
}

module.exports.help = {
  name: "/",
  admin: false
}