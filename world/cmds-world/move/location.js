const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	let name=player.location;
	if(args[0])name=args[0];
	if(world.map.getLoc(name)){
		world.channels.cache.get(world.fChannels[player.location]).createOverwrite(message.author, {VIEW_CHANNEL: false}, "move");
		world.channels.cache.get(world.fChannels[name]).createOverwrite(message.author, {VIEW_CHANNEL: true}, "move");
	};
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