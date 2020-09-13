const Discord  = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (world, message, args, player) => { 
	let name=[player.location, false];
	if(args[0]){
		name[0]=args[0];
		name[1]=true;
	};
	let location=world.map.getLoc(name[0]);
	if(!location){
		location=world.map.getLoc(player.location);
		name[1]=false;
	};
	let locations="";
	let nLocations='';
	let loc=`Вы осматриваетесь вокруг\nВы на локации **${player.location}**`;
	if(name[1])loc=`Вы смотрите в даль на локацию **${name[0]}**`;
	let nL=Math.floor(location.pass.length/10)%10*10+location.pass.length%10;
	let nLL="Они ведут на локации";
	if(nL>9 && nL<21)nL="проходов,\n";
	else{ 
		nL=location.pass.length%10;
		if(nL==1){nL='проход,\n';nLL='Он ведёт на локацию';}
		else if(nL>1 && nL<5)nL="прохода,\n";
		else if(nL>4 && nL<10 || nL==0)nL="проходов,\n";
	};
	nL+=nLL;
	if(location.pass.length>0)nLocations=`Вы видите на этой локации ${location.pass.length} ${nL} ${locations}`;
	for(let i=0;i<location.pass.length;i++)nLocations+=`\n->**${location.pass[i]}**`;
	world.sendId(`${loc}\n${nLocations}`, player.id);
};
module.exports.help = {
	name: "location"
};