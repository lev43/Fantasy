const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
    if(!args[0]){
        world.sendId(`see->**имя существа**`, player.id)
        return
    }
    let enemy=world.map.enemys.find(enemy=>enemy.name==args[0]);
    if(!enemy){
        world.sendId(`Вы осматриваетесь и не видите существа с таким именем\n(Проверьте правильно-ли ввели имя)`, player.id)
        return
    }
    world.sendId(`Вы смотрите на ${enemy.type=='player'?'игрока':'существо'} **${enemy.name}**\nУ него **${enemy.health}** хп`, player.id);
};
module.exports.help = {
	name: "enemy"
};