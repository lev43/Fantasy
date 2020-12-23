const Discord = require("discord.js")

module.exports.run = async(msg, args)=>{
  let parameters={
    name: 'NULL',
    road: [],
  }
  for(let i=0; i<args.length; i++){
    let par = args[i].split(':').shift(), val = args[i].split(':').pop()
    if(par === 'road'){
      if(global.manager.location.check(val))parameters.road.push(val)
    }else{
      parameters[par] = val
    }
  }
  global.manager.location.create(parameters)
}

module.exports.help = {
  name: "location"
}