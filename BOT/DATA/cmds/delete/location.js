const Discord = require("discord.js")

module.exports.run = async(msg, args)=>{
  global.manager.location.delete(args[0])
}

module.exports.help = {
  name: "location"
}