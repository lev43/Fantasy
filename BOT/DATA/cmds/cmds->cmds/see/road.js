module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  let road=`Вы осматриваете дороги.\n`
  if(location.road.length<1)global.send(player, road+`_Но вы не видите дорог..._\n`, 0)
  else{
    for(i in location.road){
      road+=`\`[${i}]:\`**\`${global.locations[location.road[i]].name}${args[0]=='id'?'\`\n\`ID: '+global.locations[location.road[i]].id:''}\`**\n`
    }
    global.send(player, road, 0)
  }
}

module.exports.help = {
  name: "road",
  admin: false
}