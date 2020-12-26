const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  global.say(global.enemy[message.author.id], `\`${message.author.username}:\` ${args[0]}`, 60000)
}

module.exports.help = {
  name: "/",
  admin: false
}