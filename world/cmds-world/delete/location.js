const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	if(args[0]){
		let g=world.map.deleteLoc(args[0]);
		if(g){
			world.sendId(`Вы успешно удалили локацию **${args[0]}**`, player.id);
			world.emit("delete-location", args[0], player);
		}else world.send("Локация не найдена");
	}else world.sendId("Вы не указали имя локации", player.id);
};
module.exports.help = {
	name: "location"
};