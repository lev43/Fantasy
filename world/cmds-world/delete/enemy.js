const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
	if(args[0]){
        let enemy=world.map.enemys.find(enemy=>enemy.name==args[0]);
        if(enemy){
		    let g=world.map.deleteEnemy(enemy.id);
		    world.sendId(`Вы успешно удалили существо **${args[0]}**`, player.id);
		    world.emit("delete-enemy", args[0], player);
		}else world.sendId("Существо не найдено", player.id);
	}else world.sendId("Вы не указали имя существа", player.id);
};
module.exports.help = {
	name: "enemy"
};