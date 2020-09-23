const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	let direction=player.location;
	if(args[0])direction=args[0];
	if(world.map.getLoc(direction)){
		world.channels.cache.get(world.fChannels[player.location]).createOverwrite(message.author, {VIEW_CHANNEL: false}, "move");
		world.channels.cache.get(world.fChannels[direction]).createOverwrite(message.author, {VIEW_CHANNEL: true}, "move");
	};
	let move=world.map.moveEnemy(player, direction);
	if(move){
		world.sendId(`Вы пошли в локацию ${direction}`, player.id);
		world.emit('move-player', player, direction);
	}else
		world.sendId(`Вы решили пойти по не существующей тропе и у вас не получилось.`, player.id);
};
module.exports.help = {
	name: "location"
};