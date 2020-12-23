let commands = global.dirListCommand(global.DATA.cmds + '/delete/')

module.exports.run = async (message, args)=>{
  let cmd = commands.get(args[0])
  if(cmd){
    args.shift()
    cmd.run(message, args)
  }
}

module.exports.help = {
  name: "delete",
  admin: true
}