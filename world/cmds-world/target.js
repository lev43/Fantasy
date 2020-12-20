const Discord  = module.require("discord.js");
const fs = require("fs");
const enemy = require("../enemy");

module.exports.run = async (world, message, args, player) => {
    if(args[0]){
        player.target=world.map.enemys.find(enemy=>enemy.name==args[0] && enemy.location==player.location);
    }else {
        world.sendId(`Вы не указали цель`, player.id);
        return;
    }
    if(!player.target)world.sendId(`Вы указали не существующую цель`, player.id)
    else{
        world.sendId(`Ваша новая цель **${player.target.name}**`, player.id);
        player.target=player.target.id;
    };
};
module.exports.help = {
	name: "target",
    admin: false
};