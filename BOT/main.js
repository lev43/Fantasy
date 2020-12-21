const fs = require("fs")
const Discord = require("discord.js")
require("./setting.js")//Подгружаем DATA, setting. Хранятся в global
require(global.DATA.methods)//Различные функции которые используются везде. Хранится в global
bot=new Discord.Client()
bot.commands = global.dirListCommand(global.DATA.cmds+'/')
let token = require(global.DATA.token)

bot.on("ready", ()=>{
  console.log(`Start bot`)
  global.bot.generateInvite().then(link => {
    console.log(link);
  });
})

bot.on("message", async message => {
  if(message.author.bot)return
  let msg = message.content
  let args = msg.split("->")
  let command = args.shift()

  let cmd = bot.commands.get(command)
  if(cmd){
    if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
  }
})

bot.login(token)