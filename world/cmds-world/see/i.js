const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	world.sendId(`Вас зовут **${player.name}**\nВаша точка возрождения это **${player.spawnPoint}**`, player.id);
};
module.exports.help = {
	name: "i"
};