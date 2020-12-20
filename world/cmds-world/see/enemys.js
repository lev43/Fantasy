const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => {
    let enemys=world.map.enemys.filter(enemy=>enemy.location==player.location && enemy.id!=player.id);
    if(!enemys.length>0){
        world.sendId(`Вы осматриваетесь вокруг, но никого не видите.`, player.id);
        return;
    }
    let ne=Math.floor(enemys.length/10)%10*10+enemys.length%10;
	if(ne>9 && ne<21)ne="";
	else{ 
		ne=ne%10;
		if(ne==1)ne='о';
		else if(ne>1 && ne<5)ne="а";
		else if(ne>4 && ne<10 || ne==0)ne="";
	};
    ne=`существ${ne}\n`;
    let see=`Вы осматриваетесь вокруг\nВы видите ${enemys.length} ${ne}`;
    for(let i=0;i<enemys.length;i++){
        if(enemys[i].id==player.id)continue;
        see+=`\n**${enemys[i].type}**: **${enemys[i].name}**`;
    }
	world.sendId(see, player.id);
};
module.exports.help = {
	name: "enemys"
};