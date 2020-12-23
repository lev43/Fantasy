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

bot.on("ready", ()=>{
  console.log(`Start bot`)
  global.bot.generateInvite().then(link => {
    console.log(link);
  });

  global.server.channels.cache.each(channel=>{if(channel.type=="text")channel.messages.fetch().then(messages=>{for(let i=0; i<messages.array.length/100 || i==0; i++)channel.bulkDelete(100)})})

  global.rootChannels.locations = global.server.channels.cache.find(chan=>chan.type==="category" && chan.name === "locations")
  if(!global.rootChannels.locations)
    global.server.channels.create("locations", {type: "category"}).then(chan=>global.rootChannels.locations=chan)
    
  global.rootChannels.players = global.server.channels.cache.find(chan=>chan.type==="category" && chan.name === "players")
  if(!global.rootChannels.players)
    global.server.channels.create("players", {type: "category"}).then(chan=>global.rootChannels.players=chan)
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


    let cmd = bot.commands.get(command)
    if(cmd){
      if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
    }
  }
  if(message.author.id!=bot.user.id)message.delete()
})

bot.login(token)
bot.guilds.fetch(global.setting.serverID).then(server=>global.server=server)

setInterval(()=>{
  for(id in global.locations){
    if(global.server.channels.cache.get(id))global.server.channels.cache.get(id).edit({name: global.locations[id].name})
    else global.manager.location.delete(id)
  }
  if(!Object.keys(global.locations).length>0)global.manager.location.create({name: "Central location"})
  fs.writeFile(global.DATA.locations, JSON.stringify(global.locations), err=>{if(err)throw err})
}, 10000)