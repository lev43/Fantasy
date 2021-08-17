const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let parameters={}
  for(let i=1; i<args.length; i++){
    let par = args[i].split(':').shift(), val = args[i].split(':').pop()
    parameters[par] = val
  }
  global.manager.enemy.edit(args[0], parameters)
}

module.exports.help = {
  name: "enemy"
}