const Discord  = module.require("discord.js");
const fs = require("fs");
const enemys=require('../../enemy.js');
let delay=require('../../delay');
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
    //тип,     имя,      локация спавна, айди, макс. здоровье, урон,    респавнится? агрессивность, концентрация, скорость(с каким шансом переходит на другую локацию)
    //args[0], args[1],  args[2],            , args[3],        args[4], args[5],     args[6],       args[7],      args[8]
    //add->enemy->Animal->test->central->50->10->0->0->100->100
    enemy=new type(args[1], id, parseInt(args[3]), parseInt(args[4]), spawnLoc, parseInt(args[5]), parseInt(args[6]), parseInt(args[7]), parseInt(args[8]));
    world.map.spawnEnemy(enemy);
    world.send(`**${player.name}** заспавнил ${enemy.name}`, player);
    world.sendId(`Вы заспавнили **${enemy.name}**\nHealth: **${enemy.health}**\nSpawn: **${enemy.spawnPoint}**\nid: **${enemy.id}**\nrespawn: **${Boolean(enemy.respawn)}**\ndamage: **${enemy.damage}**\nconcentration: **${enemy.concentration}**\nspeed: **${enemy.speed}**`, player.id)
};
module.exports.help = {
    name: "enemy"
};