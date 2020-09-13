const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	let arg;
	let name=player.location;
	if(args[0])name=args[0];
	let direction=world.map.getLocation(name);
	if(direction){
		world.map.moveEnemy(world, player, direction);
		world.sendId(`Вы пошли в локацию ${direction.name}`, player.id);
	}else
		if(!world.map.getLocation(name))world.sendId(`Вы пошли в несуществующую локацию.\nУ вас ничего не вышло`, player.id);
		else world.sendId(`Вы не умеете телепортироватся`, player.id);
};
module.exports.help = {
	name: "location"
};