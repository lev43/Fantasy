const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let player = global.enemy[message.author.id]
  if(!args[0]){
    global.send(player, `ID location`, 3000)
  }else{
    if(global.interface.tp(player.id, args[0])){
      global.send(player, `Вы телепортировались на локацию **${global.locations[args[0]].name}**`, 5000)
    }else global.send(player, `Вы не смогли телепортироватся на локацию`, 5000)
  }
}

module.exports.help = {
  name: "tp",
  admin: true
}