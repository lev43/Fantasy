module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  global.send(player, `Вы осматриваете дороги.\n`)
  if(location.road.length<1)global.send(player, `_Но вы не видите дорог..._\n`)
  else for(i in location.road){
    global.send(player, `[${i}] Дорога к **${global.locations[location.road[i]].name}**\n`, 60000)
  }
}

module.exports.help = {
  name: "road",
  admin: false
}