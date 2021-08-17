const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  if(!args[0]){
    let road=``
    for(i in location.road)
      road+=`\`[${i}]:\`**\`${global.locations[location.road[i]].name}\`**\n`
    global.send(player, road, 0)
    //global.send(player, `go->0\ngo->1\nИ т.д.`)
  }else{
    args[0]=parseInt(args[0])
    location = location.road[args[0]]
    if(global.interface.move(player.id, location)){
      global.send(player, `Вы перешли на локацию **${global.locations[location].name}**`, 0)

    }else global.send(player, `Вы не смогли перейти на локацию`, 0)
  }
}

module.exports.help = {
  name: "go",
  admin: false
}