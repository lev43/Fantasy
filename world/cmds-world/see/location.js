const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => { 
	let name=[player.location, false];
	if(args[0]){
		name[0]=args[0];
		name[1]=true;
	};
	let location=world.map.getLocation(name[0]);
	if(!location){
		location=world.map.getLocation(player.location);
		name[1]=false;
	};
	let locations="";
	let nEnemy='';
	let nLocations='';
	let loc=`Вы осматриваетесь вокруг\nВы на локации **${player.location}**`;
	if(name[1])loc=`Вы смотрите в даль на локацию **${name[0]}**`;
	if(location.enemys.length-(name[1]?0:1)>0)nEnemy=`Вы видите ${location.enemys.length-(name[1]?0:1)} существ\n`;
	let nLL=location.locations.length;
	if(location.parent!="NULL"){
		nLocations+=`\n->**${location.parent}**`;
		nLL++;
	};
	let nL=Math.floor(nLL/10)%10*10+nLL%10;
	if(nL>9 && nL<21)nL="проходов,\nОни ведут на локации";
	else{ 
		nL=nLL%10;
		if(nL==1)nL='проход,\nОн ведёт на локацию';
		else if(nL>1 && nL<5)nL="прохода,\nОни ведут на локации";
		else if(nL>4 && nL<10 || nL==0)nL="проходов,\nОни ведут на локации";
	};
	if(nLL>0)nLocations=`Вы видите на этой локации ${nLL} ${nL} ${locations}`+nLocations;
	for(let i=0;i<location.locations.length;i++)nLocations+=`\n->**${location.locations[i].name}**`;
	world.sendId(`${loc}\n${nEnemy}${nLocations}`, player.id);
};
module.exports.help = {
	name: "location"
};