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
global.sey=(location, msg, delay, player)=>{
  let id = location.id
  if(!id)id=location
  bot.emit('CHANNEL_MESSAGE', id, msg, delay, player) 
}

global.send=(player, msg, delay)=>{
  let channel = global.server.channels.cache.get(player.channel)
  if(!channel && !player.channel)channel = global.server.channels.cache.get(global.enemy[player].channel)
  channel.messages.fetch().then(messages=>{
    let message = messages.find(message=>message.author.id==global.bot.user.id)
    if(message)message.edit(msg)
  })
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
    id(){
      let id='0'
      while(this.check(id))id=`${Math.round(Math.random()*100000)}`
      return id
    },
    create(parameters){
      if(!parameters.name)parameters.name="NULL"
      if(!parameters.road)parameters.road=[]
      if(!global.locations)global.locations={}
      let id = this.id()
      let location = {
        name: parameters.name,
        id: id,
        road: parameters.road,
        see: parameters.see
      }
      global.locations[id] = location

      for(let i=0; i<location.road.length; i++)
        global.locations[location.road[i]].road.push(location.id)

      console.log(`Create location\nID: ${id}\nName: ${location.name}\nDescription: ${location.see}${location.road[0]?`\nRoad: ${location.road}`:''}\n`)
      return location
    },
    delete(id){
      if(global.locations[id]){
        for(i in global.locations[id].road){
          let loc=global.locations[id].road[i]
          global.locations[loc].road.splice(global.locations[loc].road.findIndex(idl=>idl==id), 1)
        }
        console.log(`Delete location\nID: ${id}\nName: ${global.locations[id].name}${global.locations[id].road[0]?`\nRoad: ${global.locations[id].road}`:''}\n`)
        delete global.locations[id]
        return true
      }else return false
    },
    edit(id, parameters){
      if(!this.check(id))return
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
      if(!enemy.maxHealth)enemy.maxHealth = 100
      if(!enemy.regeneration)enemy.regeneration = 5
      if(!enemy.regenerationPower)enemy.regenerationPower = 10
      if(!enemy.strength)enemy.strength = 1
      enemy.regenerateTime = enemy.regenerationPower
      enemy.health = enemy.maxHealth
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
        global.server.channels.create((enemy.name.tag?enemy.name.username+'-'+enemy.name.discriminator:enemy.name), {type: "text"}).then(channel=>{
          if(enemy.name.tag)enemy.name = enemy.name.tag
          enemy.channel=channel.id
          global.enemy[enemy.id]=enemy
          console.log(`Create enemy\nID: ${enemy.id}\nName: ${enemy.name}\nType: ${enemy.type}\nSpawn: ${enemy.spawn}\nChannel: ${enemy.channel}\n`)
          return enemy
        })
      }
    },
    delete(id){
      if(this.check(id)){
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
      if(!this.check(id))return
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
      let enemy = global.enemy[enemyID]
      if(global.locations[enemy.location].road.find(location=>location==locationID)){
        global.sey(enemy.location, `**${enemy.name}**, ушел отсюда.`, 0, enemy)
        global.sey(locationID, `**${enemy.name}**, пришел сюда.`, 0, enemy)

        global.enemy[enemyID].location = locationID
        return true
      }
    }
    return false
  },
  tp(enemyID, locationID){
    if(global.manager.enemy.check(enemyID) && global.manager.location.check(locationID)){
      let enemy = global.enemy[enemyID]
      global.sey(enemy.location, `**${enemy.name}**, исчез отсюда.`, 0, enemy)
      global.sey(locationID, `**${enemy.name}**, появился здесь.`, 0, enemy)

      global.enemy[enemyID].location = locationID
      return true
    }
    return false
  },
  attack(AttackingEnemyID, AttackedEnemyID){
    //console.log(global.enemy[AttackingEnemyID], global.enemy[AttackedEnemyID])
    if(global.enemy[AttackingEnemyID] && global.enemy[AttackedEnemyID]){
      let armor = Math.round(global.enemy[AttackedEnemyID].strength/10)
      let baseDamage = 15 * global.enemy[AttackingEnemyID].strength
      let damage = Math.round(baseDamage / (armor==0?1:armor))

      global.enemy[AttackedEnemyID].health-=damage


      if(global.enemy[AttackingEnemyID].type == 'player'){
        global.enemy[AttackingEnemyID].strength += 0.003 * global.enemy[AttackingEnemyID].strength
        global.send(AttackingEnemyID, `Вы Атаковали **${global.enemy[AttackedEnemyID].name}**\n\`Урон:\`${damage}`)
      }


      if(global.enemy[AttackedEnemyID].type == 'player'){
        global.enemy[AttackedEnemyID].maxHealth += Math.round(0.01 * global.enemy[AttackingEnemyID].strength / global.enemy[AttackedEnemyID].strength)
        global.send(AttackedEnemyID, `**Вас атаковали!**\n\`Атакующий:\`**${global.enemy[AttackingEnemyID].name}**\n\`Урон:\`**${damage}**`)
      }
      return true

    }
    return false
  },
  updateHealth(EnemyID){
    let enemy = global.enemy[EnemyID]
    if(enemy){
      if(enemy.health>enemy.maxHealth)global.enemy[EnemyID].health=enemy.maxHealth
      global.enemy[EnemyID].health=Math.round(global.enemy[EnemyID].health)
    }
  },
  checkDead(EnemyID){
    let enemy = global.enemy[EnemyID]
    return enemy.health<=0
  },
  regenerate(EnemyID, regeneration){
    let enemy = global.enemy[EnemyID]
    if(enemy){
      if(!regeneration)regeneration = global.enemy[EnemyID].regenerationPower
      if(enemy.health<enemy.maxHealth){
        global.enemy[EnemyID].health+=regeneration
        this.updateHealth(EnemyID)
        if(enemy.type=='player')global.send(enemy, `Вы регенерировали **${regeneration}HP**`)
      }
    }
  },
  updateEnemy(EnemyID){
    if(global.enemy[EnemyID]){
      global.enemy[EnemyID].strength -= global.enemy[EnemyID].strength/1000
      global.enemy[EnemyID].maxHealth -= Math.trunc(global.enemy[EnemyID].maxHealth/100/global.enemy[EnemyID].strength)
    }
  }
}