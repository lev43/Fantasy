const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let player = global.enemy[message.author.id]
  if(args[0]!='yes')global.send(player, `Напишите \`reset/yes\` Если вы уверены что хотите сбросить себя`)
  else{
    if(!global.manager.enemy.delete(player.id))global.send(`Нам не удалось сросить вас`)
  }
}

module.exports.help = {
  name: "reset",
  admin: false
}