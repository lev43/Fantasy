const Discord  = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (world, message, args, player) => {
	let dir='';
	let cmds='Commands:```';
	if(args[0]){
		dir=args[0];
		cmds+=`\n${dir}:`;
	};
	fs.readdir('./cmds-world/'+dir+'/', (err, files)=>{
		if(err)return;
		let commands=files.filter(f => f.split(".").pop() === "js");
		for(i in commands){
			let cmd=require(`./${commands[i]}`)
			if(!cmd.help.admin || message.member.hasPermission("ADMINISTRATOR")){
				cmd=commands[i].split('.').shift();
				cmds+=`\n${dir.length>0?'->':''}${cmd}`;
				if(files.indexOf(cmd)>=0){
					fs.readdir('./cmds-world/'+cmd+'/', (err, files2)=>{
						let commands2=files2.filter(f => f.split(".").pop() === "js");
					});
				};
			}
		};
		cmds+='\n```';
		world.sendId(cmds, player.id);
	});
};
module.exports.help = {
	name: "help",
    admin: false
};