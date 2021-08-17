const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  global.sey(global.enemy[message.author.id].location, `\`${message.author.username}:\` ${args[0]}`)
}

module.exports.help = {
  name: "/",
  admin: false
}