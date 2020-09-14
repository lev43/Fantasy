const Discord  = module.require("discord.js");
const fs = require("fs");
const Location=require('../../world.js').Location;
module.exports.run = async (world, message, args, player) => {
	let arg;
	let location=new Location()
	let pass=[];
	for(let i=0;i<args.length;i++){
		arg=args[i].split(":");
		if(arg[0]=='pass'){
			let name=world.map.getLoc(arg[1]).name;
			if(!name)continue;
			let y=false;
			for(let i=1;i<=pass.length;i++){
				if(pass[i]==name)y=true;
			};
			if(!y)pass.push(name);
		}else location[arg[0]]=arg[1];
	};
	if(pass.length<1)pass.push(world.map.locations[0].name);
	location.s();
	location.pass=pass;
	let hasAdd=world.map.addLoc(location);
	if(hasAdd){
		for(let i=0;i<pass.length;i++)world.map.getLoc(pass[i]).pass.push(location.name);
		world.sendId(`Вы создали локацию **${location.name}**!\nРазмер: **${location.size}**`, player.id);
		world.emit("create-location", location, player);
		if(!world.fChannels[location.name]){
			message.guild.channels.create(location.name, {type:'text', parent:'754988488423899226'})
			.then(channel=>{world.fChannels[location.name]=channel.id; console.log("new channel location!", channel.id);}).catch(console.error);
		};
	}else world.sendId(`**Такая локация уже существует!!!**`, player.id);
};
module.exports.help = {
	name: "location"
};