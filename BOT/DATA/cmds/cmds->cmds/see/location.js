module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  if(args[0]=='id')global.send(player, player.location, 0)
  else global.send(player, `Вы осматриваетесь вокруг.\nВы на локации **${location.name}**\n${location.see?location.see:''}`, 0)
}

module.exports.help = {
  name: "location",
  admin: false
}