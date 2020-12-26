let cmds = global.cmds

let commands={}
for(i in cmds)
  commands[cmds[i]] = global.dirListCommand(global.DATA.cmds + `/cmds->cmds/${cmds[i]}/`)

module.exports.run = async (message, args)=>{
  let cmd = commands[args[0]].get(args[1])
  if(cmd){
    args.shift()
    args.shift()
    if(!cmd.help.admin || global.checkAdmin(message))cmd.run(message, args)
  }
}

module.exports.help = {
  name: "cmds",
  admin: false
}