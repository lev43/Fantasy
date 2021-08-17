const Discord = require("discord.js")

module.exports.run = async(msg, args)=>{
  global.manager.enemy.delete(args[0])
}

module.exports.help = {
  name: "location"
}