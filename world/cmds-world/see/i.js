const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	world.send(`Вас зовут **${player.name}**\nВаша точка возрождения это **${player.spawnPoint}**\nВаша скорость **${player.speed}**`);
};
module.exports.help = {
	name: "i"
};