module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let stats = `Ваши параметры\n`
  stats+=`\`Жизнь:\`**${player.health}/${player.maxHealth}**\n`
  stats+=`\`Сила:\`**${Math.trunc(player.strength*1000)/10}**\n`
  stats+=`\`Частота регенерации\`**${player.regeneration}**\n`
  stats+=`\`Сила регенерации\`**${player.regenerationPower}**\n`
  if(args[0]=='id'){
    stats+=`**${player.id}**`
  }
  global.send(player, stats)
}

module.exports.help = {
  name: "i",
  admin: false
}