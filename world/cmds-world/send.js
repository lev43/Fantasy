const Discord  = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (world, message, args, player) => {
	let msg=message.content.slice(6);
	world.send(`**${player.name}**: ${msg}`, player);
};
module.exports.help = {
	name: "send"
};