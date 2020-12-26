const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let player = global.enemy[message.author.id]
  if(!args[0]){
    for(i in global.locations[player.location].road)
      global.send(player, `\`[${i}]:\`**\`${global.locations[global.locations[player.location].road[i]].name}\`**\n`, 5000)
    //global.send(player, `go->0\ngo->1\nИ т.д.`)
  }else{
    args[0]=parseInt(args[0])
    let location = global.locations[player.location].road[args[0]]
    if(global.interface.move(player.id, location)){
      global.send(player, `Вы перешли на локацию **${global.locations[location].name}**`, 5000)

    }else global.send(player, `Вы не смогли перейти на локацию`, 5000)
  }
}

module.exports.help = {
  name: "go",
  admin: false
}