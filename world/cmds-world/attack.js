const Discord  = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (world, message, args, player) => {
    if(args[0]){
        player.target=world.map.enemys.find(enemy=>enemy.name==args[0] && enemy.location==player.location);
        if(player.target)player.target=player.target.id;
    }
    if(!player.target){
        world.sendId(`Вы не имеете цели для атаки`, player.id)
        return;
    }
    let target=world.map.enemys.find(enemy=>enemy.id==player.target);
    world.sendId(`Вы атакуете **${target.name}**`, player.id);
    if(target.type=='player')
        world.sendId(`Вас атакует **${player.name}**`, target.id);
    target.health-=player.damage;
};
module.exports.help = {
	name: "attack",
    admin: false
};