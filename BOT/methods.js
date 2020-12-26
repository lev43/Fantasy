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
global.say=(ch, msg, delay)=>{
  if(ch.channel && ch.content)ch=ch.channel
  if(ch.channel && ch.location)ch=global.server.channels.cache.get(ch.location)
  ch.send(msg).then(msg=>{if(delay>0)setTimeout(()=>msg.delete(), delay)})
}

global.send=(player, msg)=>{
  let channel = global.server.channels.cache.get(player.channel)
  channel.send(msg)
}


global.manager = {
  road: {
    add(id1, id2){
      if(!global.manager.location.check(id1) || !global.manager.location.check(id2))return
      global.locations[id1].road.push(id2)
      global.locations[id2].road.push(id1)
      console.log(`Add road from ${id1} to ${id2}`)
    },
    delete(id1, id2){
      if(!global.manager.location.check(id1) || !global.manager.location.check(id2))return
      if(global.locations[id1].road.findIndex(id=>id==id2)>=0)
        global.locations[id1].road.splice(global.locations[id1].road.findIndex(id=>id==id2), 1)
      if(global.locations[id2].road.findIndex(id=>id==id1)>=0)
        global.locations[id2].road.splice(global.locations[id2].road.findIndex(id=>id==id1), 1)
      console.log(`Delete road from ${id1} to ${id2}`)
    }
  },
  location: {
    create(parameters){
      if(!parameters.name)parameters.name="NULL"
      if(!parameters.road)parameters.road=[]
      let id
      if(!global.locations)global.locations={}
      global.server.channels.create(parameters.name, {type: "text", parent: global.rootChannels.locations}).then(channel=>{
        id=channel.id
        channel.edit({topic: channel.id})
        let location = {
          name: parameters.name,
          id: id,
          road: parameters.road,
          see: parameters.see
        }
        global.locations[id] = location

        for(let i=0; i<location.road.length; i++)
          global.locations[location.road[i]].road.push(location.id)

        console.log(`Create location\nID: ${id}\nName: ${location.name}${location.road[0]?`\nRoad: ${location.road}`:''}\n`)
        return location
      })
    },
    delete(id){
      if(global.locations[id]){
        for(i in global.locations[id].road){
          let loc=global.locations[id].road[i]
          global.locations[loc].road.splice(global.locations[loc].road.findIndex(idl=>idl==id), 1)
        }
        let channel = global.server.channels.cache.get(id)
        if(channel)channel.delete()
        console.log(`Delete location\nID: ${id}\nName: ${global.locations[id].name}${global.locations[id].road[0]?`\nRoad: ${global.locations[id].road}`:''}\n`)
        delete global.locations[id]
        return true
      }else return false
    },
    edit(id, parameters){
      if(!global.manager.location.check(id))return
      console.log(`Edit location ${id}\n`)
      for(p in parameters){
        console.log(`Parameter: ${p}\nNew value: ${parameters[p]}\n`)
        global.locations[id][p]=parameters[p]
      }
    },
    get(id){
      return global.locations[id]
    },
    check(id){
      return (global.locations[id]?1:0)
    }
  },
  enemy: {
    create(enemy){
      if(!global.locations[Object.keys(global.locations)[0]])return false
      if(!enemy.name)enemy.name="NULL"
      if(!enemy.type)enemy.type="enemy"
      if(!enemy.spawn)enemy.spawn=global.locations[Object.keys(global.locations)[0]].id
      enemy.location=enemy.spawn
      if(!enemy.id){
          global.server.roles.create({
            data: {
              name: enemy.name,
              mentionable: true,
              color: enemy.type
            }
          }).then(role=>{
            enemy.id=role.id
            global.enemy[enemy.id]=enemy
            console.log(`Create enemy\nID: ${id}\nName: ${enemy.name}\nType: ${enemy.type}\nSpawn: ${enemy.spawn}\n`)
            return enemy
          })
      }else{
        global.server.channels.create((enemy.name.tag?enemy.name.username+'-'+enemy.name.discriminator:enemy.name), {type: "text", parent: global.rootChannels.players}).then(channel=>{
          if(enemy.name.tag)enemy.name = enemy.name.tag
          enemy.channel=channel.id
          global.enemy[enemy.id]=enemy
          console.log(`Create enemy\nID: ${enemy.id}\nName: ${enemy.name}\nType: ${enemy.type}\nSpawn: ${enemy.spawn}\nChannel: ${enemy.channel}\n`)
          return enemy
        })
      }
    },
    delete(id){
      if(global.enemy[id]){
        global.server.roles.fetch(id).then(role=>{
          if(role)role.delete()
          global.server.channels.cache.delete(enemy.channel)
          console.log(`Delete enemy\nID: ${id}\nName: ${global.enemy[id].name}\nType: ${global.enemy[id].type}\n`)
          delete global.enemy[id]
          return true
        })
      }else return false
    },
    edit(id, parameters){
      if(!global.manager.enemy.check(id))return
      console.log(`Edit enemy ${id}\n`)
      for(p in parameters){
        console.log(`Parameter: ${p}\nNew value: ${parameters[p]}\n`)
        global.enemy[id][p]=parameters[p]
      }
    },
    get(id){
      return global.enemy[id]
    },
    check(id){
      return (global.enemy[id]?1:0)
    }
  }
}

global.interface = {
  move(enemyID, locationID){
    if(global.manager.enemy.check(enemyID) && global.manager.location.check(locationID)){
      if(global.locations[global.enemy[enemyID].location].road.find(location=>location==locationID)){
        global.enemy[enemyID].location = locationID
        return true
      }
    }
    return false
  }
}