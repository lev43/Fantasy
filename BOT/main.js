const fs = require("fs")
const Discord = require("discord.js")
if(global.locations)global.locations={}
global.rootChannels={}
require("./setting.js")//Подгружаем DATA, setting. Хранятся в global
require(global.DATA.methods)//Различные функции которые используются везде. Хранится в global
bot=new Discord.Client()
bot.commands = global.dirListCommand(global.DATA.cmds+'/')
let token = require(global.DATA.token)
global.locations=JSON.parse(fs.readFileSync(global.DATA.locations, "utf8"))
global.enemy=JSON.parse(fs.readFileSync(global.DATA.enemy, "utf8"))
global.cmds = ['add', 'delete', 'edit', 'see', 'attack']

function update_player(){
  global.server.members.fetch().then(members=>{
    members.filter(member=>!member.user.bot).each(member=>{
      let player = global.enemy[member.id]
      if(!player)global.manager.enemy.create({name: member.user, id: member.id, type: 'player'})
      else{
        global.server.channels.cache.each(channel=>{
          let VIEW = channel.id == player.channel
          let update = (channel.permissionsFor(member).bitfield==104320577)!=VIEW
          let permissions = {VIEW_CHANNEL: VIEW, SEND_MESSAGES: VIEW}
          if(update && !player.updateChannel){
            player.updateChannel = true
            channel.updateOverwrite(member, permissions).then(c=>{player.updateChannel=false})
          }
        })
      }
    })
  })

  for(id in global.enemy){
    let enemy = global.enemy[id]
    if(enemy.type=='player'){
      if(Object.keys(global.locations).length>0){
        if(!global.locations[enemy.spawn]){
          enemy.spawn = global.locations[Object.keys(global.locations)[0]].id
        }
        if(!global.locations[enemy.location]){
          enemy.location = enemy.spawn
        }
      }
    }
    if(enemy){
      if(global.interface.checkDead(enemy.id)){
        global.enemy[enemy.id].location=enemy.spawn
        global.enemy[enemy.id].health=enemy.maxHealth
        if(enemy.type=='player'){
          global.send(enemy, `**Вы погибли**\nВы перемещенны на локацию **${global.locations[enemy.spawn].name}**`)
        }
        global.sey(enemy.location, `**${enemy.name}** погиб(ла)`, 0, enemy)
      }else{
        if(enemy.regenerateTime<1){
          global.interface.regenerate(enemy.id)
          global.enemy[enemy.id].regenerateTime=enemy.regeneration
        }else global.enemy[enemy.id].regenerateTime--;
        global.interface.updateHealth(enemy.id)
      }
    }
  }

  
  fs.writeFile(global.DATA.enemy, JSON.stringify(global.enemy), err=>{if(err)throw err})
}

bot.on("ready", ()=>{
  console.log(`Start bot`)
  global.bot=bot
  global.bot.generateInvite().then(link => {
    console.log(link);
  });

  bot.guilds.fetch(global.setting.serverID).then(guild=>{
    global.server = guild

    guild.channels.cache.each(channel=>{if(channel.type=="text")channel.messages.fetch().then(messages=>{for(let i=0; i<messages.array.length/100 || i==0; i++)channel.bulkDelete(100)})})

    for(i in global.enemy){
      if(global.enemy[i].type=='player' && !guild.channels.cache.get(global.enemy[i].channel))
        guild.channels.create(global.enemy[i].name, {type: "text", parent: global.rootChannels.players}).then(chan=>global.enemy[i].channel=chan.id)
    }


    bot.user.setActivity('Fantasy world', { type: 'WATCHING' });

    
    bot.setInterval(()=>{
      if(!Object.keys(global.locations).length>0)global.manager.location.create({name: "Central location"})
      

      global.server.channels.cache.each(channel=>{
        let y=false;
        for(i in global.enemy)
          if(global.enemy[i].type=='player' && global.enemy[i].channel==channel.id){y=true;break}
        if(!y)channel.delete()
      })

      fs.writeFile(global.DATA.locations, JSON.stringify(global.locations), err=>{if(err)throw err})
    }, 10000, [])

    bot.setInterval(()=>{
      for(id in global.enemy){
        let player = global.enemy[id]
        if(player.type=='player'){
          guild.channels.resolve(player.channel).send('\`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\`')
        }
      }
    }, 5000)

    bot.setInterval(()=>{
      update_player()
    }, 1000, [])
    bot.setInterval(()=>{
      for(id in global.enemy){
        let player = global.enemy[id]
        if(player.type=='player'){
          global.interface.updateEnemy(player.id)
          global.send(player, `Ваши характеристики понижены`)
        }
      }
    }, 20*10000)
  })
})

bot.on("message", async message => {
  if(!message.author.bot){
    let player = global.enemy[message.author.id]
    if(!player)global.manager.enemy.create({name: message.author.username, type: "player", id: message.author.id})
    let msg = message.content
    let args = msg.split("/")
    let command = args.shift()
    if(msg[0]=='/'){
      command='/'
      args[0]=msg.slice(1)
    }
    if(msg[0]=='!'){
      command='!'
      args[0]=msg.slice(1)
    }

    if(global.cmds.find(cmd=>cmd==command)){
      args.unshift(command)
      command='cmds'
    }
    if(message.author.id!=bot.user.id)message.delete()
    let cmd = bot.commands.get(command)
    if(cmd){
      if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
    }
  }else if(message.author.id!=bot.user.id)message.delete()
})

bot.on('CHANNEL_MESSAGE', (channelID, content, delay, player1)=>{
  let channel
  if(typeof channelID == 'string')channel = global.server.channels.resolve(channelID)
  else{channel = channelID; channelID = channel.id}
  for(i in global.enemy){
    let player = global.enemy[i]
    if(player.type == 'player' && player.location == channelID && (player1?player1.id!=player.id:true)){
      global.send(player, content)
    }
  }
})

bot.login(token)