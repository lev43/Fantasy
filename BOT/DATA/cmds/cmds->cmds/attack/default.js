module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let enemys = []
  for(id in global.enemy)if(global.enemy[id].location==player.location && id!=player.id)enemys.push(global.enemy[id])
  let attackedEnemy = enemys[parseInt(args[0])]
  if(!attackedEnemy){
    global.send(player, `Нету такого противника`)
  }else{
    if(!global.interface.attack(player.id, attackedEnemy.id))global.send(player, `Кто-то из вас не существует`)
  }
}

module.exports.help = {
  name: "",
  admin: false
}