const Discord = require("discord.js")

module.exports.run = async(msg, args)=>{
  global.send(msg, args[0])
  msg.delete()
}

module.exports.help = {
  name: "echo",
  admin: false
}