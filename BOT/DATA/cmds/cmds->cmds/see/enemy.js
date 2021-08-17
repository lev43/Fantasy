module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  let enemys=[]
  let enemy=`Вы смотрите кто рядом.\n`
  for(id in global.enemy)if(global.enemy[id].location==location.id && id!=player.id)enemys.push(global.enemy[id])
  if(enemys.length<1)global.send(player, enemy+`_Но вы не видите существ..._\n`, 0)
  else{
    for(i in enemys){
      enemy+=`\`[${i}]:\`**\`${enemys[i].name}${args[0]=='id'?'\`\n\`ID: '+enemys[i].id:''}\`**\n`
    }
    global.send(player, enemy, 0)
  }
}

module.exports.help = {
  name: "enemy",
  admin: false
}