const Discord = require("discord.js")

module.exports.run = async(message, args)=>{
  let parameters={
    name: 'NULL',
    road: []
  }
  for(let i=1; i<args.length; i++){
    let par = args[i].split(':').shift(), val = args[i].split(':').pop()
    if(par === 'road'){
      if(global.manager.location.check(val))parameters.road.push(val)
    }else{
      parameters[par] = val
    }
  }
  global.manager.location.edit(args[0], parameters)
}

module.exports.help = {
  name: "location"
}