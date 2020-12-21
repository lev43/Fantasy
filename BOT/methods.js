const Discord = require("discord.js")
const fs = require('fs')

global.dirList = (dir, type="*")=>{
  let list = new Discord.Collection()
  fs.readdir(dir, (err, files)=>{
    if(err)throw err;
    files = files.filter(f=>f.split('.').pop() === type || type === "*")
    files.forEach(f=>{
      let file = require(`${dir}${f}`)
      list.set(f.split('.').shift(), file)
    })
  })
  return list
}

global.dirListCommand = (dir)=>{
  let list = new Discord.Collection()
  fs.readdir(dir, (err, files)=>{
    if(err)throw err;
    //dir = './' + dir.split('/')[2] + '/'
    files = files.filter(f=>f.split('.').pop() === 'js')
    files.forEach(f=>{
      let file = require(`${dir}${f}`)
      list.set(file.help.name, file)
    })
  })
  return list
}

global.checkAdmin=(m)=>{
  if(m.member)m=m.member
  return m.hasPermission("ADMINISTRATOR")
}
global.send=(ch, msg)=>{
  if(ch.channel)ch=ch.channel
  ch.send(msg)
}