const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	world.sendId(`Вас зовут **${player.name}**\nВаша точка возрождения **${player.spawnPoint}**\nВаши жизни **${player.health}/${player.maxHealth}**\nВаша концентрация **${player.concentration}**\nВаш урон **${player.damage}**`, player.id);
};
module.exports.help = {
	name: "i"
};