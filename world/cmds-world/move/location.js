const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	let arg;
	let name=player.location;
	if(args[0])name=args[0];
	let direction=world.map.getLocation(name, player.speed, world.map.getLocation(player.location));
	if(direction){
		world.map.moveEnemy(world, player, direction);
		world.send(`Вы пошли в локацию ${direction.name}`);
	}else
		if(!world.map.getLocation(name))world.send(`Вы пошли в несуществующую локацию.\nУ вас ничего не вышло`);
		else world.send(`Вы не умеете телепортироватся`);
};
module.exports.help = {
	name: "location"
};