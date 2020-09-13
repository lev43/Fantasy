const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	let name=player.location;
	if(args[0])name=args[0];
	let move=world.map.moveEnemy(player, name);
	if(move){
		world.sendId(`Вы пошли в локацию ${name}`, player.id);
		world.emit('move-player', player, name);
	}else
		world.sendId(`Вы пошли в несуществующую локацию.\nУ вас ничего не вышло`, player.id);
};
module.exports.help = {
	name: "location"
};