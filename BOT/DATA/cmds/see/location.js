module.exports.run = async (message, args)=>{
  let player = global.enemy[message.author.id]
  let location = global.locations[player.location]
  global.send(player, `Вы осматриваетесь вокруг.\nВы на локации **${location.name}**\n`, 60000)
}

module.exports.help = {
  name: "location",
  admin: false
}