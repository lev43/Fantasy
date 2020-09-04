const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args) => {
	if(args[0]){
		let g=world.map.deleteLocation(args[0]);
		if(g){
			world.send("Локация успешно удаленна");
			world.emit("delete-location", args[0]);
		}else world.send("Локация не найдена");
	}else world.send("Вы не указали имя локации");
};
module.exports.help = {
	name: "location"
};