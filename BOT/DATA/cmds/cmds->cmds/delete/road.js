const Discord = require("discord.js")

module.exports.run = async(msg, args)=>{
  global.manager.road.delete(args[0], args[1])
}

module.exports.help = {
  name: "road"
}