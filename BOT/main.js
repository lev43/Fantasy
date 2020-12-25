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

    setInterval(()=>{
      for(id in global.locations){
        if(guild.channels.cache.get(id))guild.channels.cache.get(id).edit({name: global.locations[id].name})
        else global.manager.location.delete(id)
      }
      if(!Object.keys(global.locations).length>0)global.manager.location.create({name: "Central location"})
      

      guild.channels.cache.filter(channel=>channel.parent==global.rootChannels.players).each(channel=>{
        let y=false;
        for(i in global.enemy)
          if(global.enemy[i].type=='player' && global.enemy[i].channel==channel.id)y=true
        if(!y)channel.delete()
      })


      guild.members.fetch().then(members=>{
        members.filter(member=>!member.user.bot).each(member=>{
          if(!global.manager.enemy.check(member.id))
            global.manager.enemy.create({name: member.user.username, type: "player", id: member.id})
        })
      })

      for(id in global.enemy){
        let player = global.enemy[id]
        if(player.type=='player'){
          guild.channels.cache.filter(channel=>channel.id!=player.channel && channel.id!=player.location).each(channel=>{
            guild.members.fetch(id).then(member=>channel.createOverwrite(member, {VIEW_CHANNEL: false, SEND_MESSAGES: false}))
          })
        }
      }

      for(id in global.enemy){
        let player = global.enemy[id]
        if(player.type=='player'){
          guild.members.fetch(id).then(member=>{
            guild.channels.cache.get(player.channel).createOverwrite(member, {VIEW_CHANNEL: true, SEND_MESSAGES: true})
            guild.channels.cache.get(player.location).createOverwrite(member, {VIEW_CHANNEL: true, SEND_MESSAGES: true})
          })
        }
      }

      fs.writeFile(global.DATA.locations, JSON.stringify(global.locations), err=>{if(err)throw err})
      fs.writeFile(global.DATA.enemy, JSON.stringify(global.enemy), err=>{if(err)throw err})
    }, 1000)
  })
})

bot.on("message", async message => {
  if(!message.author.bot){
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

    let cmd = bot.commands.get(command)
    if(cmd){
      if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
    }
  }
  if(message.author.id!=bot.user.id)message.delete()
})

bot.login(token)