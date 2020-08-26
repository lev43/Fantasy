const Discord  = module.require("discord.js");
const fs = require("fs");
const Location=require('../../world.js').Location;
module.exports.run = async (world, message, args) => {
	let arg;
	let location=new Location()
	let loc=world.map.locations;
	for(let i=0;i<args.length;i++){
		arg=args[i].split(":");
		if(arg[0]=='^'){
			loc=world.wm.getLocation(loc, arg[1]);
		}else location[arg[0]]=arg[1];
	};
	location.s();
	if(location.integrityCheck()){
		world.wm.addLocation(loc, location);
		world.send("Локация успешно созданна!");
		world.emit("create-location", location);
	}else world.send("Вы создали сломанную локацию\nОна само разрушилась");
};
module.exports.help = {
	name: "location"
};