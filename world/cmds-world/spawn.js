const Discord  = module.require("discord.js");
const fs = require("fs");
const enemys=require('../enemy.js');
let delay=require('../delay');
function random(min=0, max=999999){
    return Math.floor(Math.random()*max+min);
}

module.exports.run = async (world, message, args, player) => {
    if(!message.member.hasPermission("ADMINISTRATOR"))return;
    let type=enemys[args[0]];
    let spawnLoc=world.map.getLoc(args[2]);
    if(!spawnLoc)spawnLoc=world.map.getLoc(player.location);
    if(!type)type=enemys.Animal;
    let id;
    function generate_id(){
        let i=0;
        while(i<9^2){
            i++;
            id=random(1, 9^9)+i;
            if(!world.map.getEnemy(id))return id;
        }
        return false;
    }
    id=generate_id();
    if(id==false){
        console.log('Не удалось найти айди для существа', id);
        return;
    }
    let enemy;
    enemy=new type(args[1], id, parseInt(args[3]), spawnLoc, parseInt(args[4]));
    world.map.spawnEnemy(enemy);
    world.send(`**${player.name}** заспавнил ${enemy.name}`, player);
};
module.exports.help = {
	name: "spawn"
};