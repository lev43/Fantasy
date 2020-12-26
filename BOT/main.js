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
global.cmds = ['add', 'delete', 'edit', 'see']

function update_player(){
  global.server.members.fetch().then(members=>{
    members.filter(member=>!member.user.bot).each(member=>{
      let player = global.enemy[member.id]
      if(player){
        global.server.channels.cache.each(channel=>{
          let VIEW = channel.id == player.channel || channel.id == player.location
          let update = (channel.permissionsFor(member).bitfield==104320577)!=VIEW
          //if(player.name=='lev43#7549' && channel.id == player.channel)console.log(channel.permissionsFor(member).bitfield, VIEW, update)
          let permissions = {VIEW_CHANNEL: VIEW, SEND_MESSAGES: VIEW}
          if(update && !player.updateChannel){
            player.updateChannel = true
            channel.updateOverwrite(member, permissions).then(c=>{/*if(player.name=='lev43#7549')console.log(c.name, update);*/ player.updateChannel=false})
          }
        })
      }else global.manager.enemy.create({name: member.user, id: member.id, type: 'player'})
    })
  })

  for(id in global.enemy){
    let player = global.enemy[id]
    if(player.type=='player'){
      if(Object.keys(global.locations).length>0){
        if(!global.locations[player.spawn]){
          player.spawn = global.locations[Object.keys(global.locations)[0]].id
        }
        if(!global.locations[player.location]){
          player.location = player.spawn
        }
      }
    }
  }
  
  fs.writeFile(global.DATA.enemy, JSON.stringify(global.enemy), err=>{if(err)throw err})
}

bot.on("ready", ()=>{
  console.log(`Start bot`)
  global.bot.generateInvite().then(link => {
    console.log(link);
  });

  bot.guilds.fetch(global.setting.serverID).then(guild=>{
    global.server = guild

    //guild.channels.cache.each(channel=>{if(channel.type=="text")channel.messages.fetch().then(messages=>{for(let i=0; i<messages.array.length/100 || i==0; i++)channel.bulkDelete(100)})})
    
    
    /*bot.ws.on('INTERACTION_CREATE', async interaction => {
      //console.log(interaction)
      console.log(bot.api.applications(bot.user.id).guilds(global.setting.serverID).commands(interaction.data.id).delete())
    })*/
    
    //guild.channels.cache.filter(channel=>channel.type != 'category').each(channel=>channel.delete())
    
    global.rootChannels.locations = guild.channels.cache.find(chan=>chan.type==="category" && chan.name === "locations")
    if(!global.rootChannels.locations)
    guild.channels.create("locations", {type: "category"}).then(chan=>global.rootChannels.locations=chan)
    
    global.rootChannels.players = guild.channels.cache.find(chan=>chan.type==="category" && chan.name === "players")
    if(!global.rootChannels.players)
    guild.channels.create("players", {type: "category"}).then(chan=>global.rootChannels.players=chan)
    

    for(i in global.enemy){
      if(global.enemy[i].type=='player' && !guild.channels.cache.get(global.enemy[i].channel))
        guild.channels.create(global.enemy[i].name, {type: "text", parent: global.rootChannels.players}).then(chan=>global.enemy[i].channel=chan.id)
    }


    bot.user.setActivity('Fantasy world', { type: 'WATCHING' });

    
    bot.setInterval(()=>{
      for(id in global.locations){
        if(global.server.channels.cache.get(id))global.server.channels.cache.get(id).edit({name: global.locations[id].name})
        else global.manager.location.delete(id)
      }
      if(!Object.keys(global.locations).length>0)global.manager.location.create({name: "Central location"})
      

      global.server.channels.cache.filter(channel=>channel.parent==global.rootChannels.players).each(channel=>{
        let y=false;
        for(i in global.enemy)
          if(global.enemy[i].type=='player' && global.enemy[i].channel==channel.id){y=true;break}
        if(!y)channel.delete()
      })

      global.server.channels.cache.filter(channel=>channel.parent==global.rootChannels.locations).each(channel=>{
        if(!global.locations[channel.id])channel.delete()
      })

      fs.writeFile(global.DATA.locations, JSON.stringify(global.locations), err=>{if(err)throw err})
    }, 10000, [])


    bot.setInterval(()=>{
      update_player()
    }, 1000, [])
  })
})

bot.on("message", async message => {
  if(!message.author.bot){
    let player = global.enemy[message.author.id]
    if(!player)global.manager.enemy.create({name: message.author.username, type: "player", id: message.author.id})
    let msg = message.content
    let args = msg.split("->")
    let command = args.shift()
    if(command[0]=='/'){
      command='/'
      args[0]=msg.slice(1)
    }
    if(command[0]=='!'){
      command='!'
      args[0]=msg.slice(1)
    }

    if(global.cmds.find(cmd=>cmd==command)){
      args.unshift(command)
      command='cmds'
    }
    let cmd = bot.commands.get(command)
    if(cmd){
      if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
    }
  }
  /*global.server.members.fetch().then(members=>{
    members.filter(member=>!member.user.bot).each(member=>{
      let player = global.enemy[member.id]
      if(player){
        global.server.channels.cache.each(channel=>{
          let VIEW = channel.id == player.channel || channel.id == player.location
          let permissions = {VIEW_CHANNEL: VIEW, SEND_MESSAGES: VIEW}
          channel.updateOverwrite(member, permissions).then(c=>{if(player.name=='lev43#7549' && VIEW)console.log('!', c.name)})
        })
      }else global.manager.enemy.create({name: member.user, id: member.id, type: 'player'})
    })
  })*/
  if(message.author.id!=bot.user.id)message.delete()
})

bot.login(token)