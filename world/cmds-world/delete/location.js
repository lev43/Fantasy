const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args) => {
	let arg=args[0].split(":");
	if(arg[0]=="name"){
		let g=world.wm.deleteLocation(world.map.locations, arg[1]);
		if(g){
			world.send("Локация успешно удаленна");
			world.emit("delete-location", arg[1]);
		}else world.send("Локация не найдена");
	}else world.send("Вы не указали имя локации");
};
module.exports.help = {
	name: "location"
};