const Discord = require('discord.js');
const world = new Discord.Client();
const ii=require('./intelligence-of-creatures.js');
const readline=require('readline');
const rl=readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt:'> ',
});
world.commands = new Discord.Collection();
const fs = require('fs');
let config = require('./botconfig.json');
let token = config.world;
let cv=config.console;//console visibility

let worldFile=fs.readFileSync("world.json", "utf8");
let enemysFile=fs.readFileSync("enemy.json", "utf8");
world.fChannels=JSON.parse(fs.readFileSync("channel-player.json", "utf8"));
const World=require('./world.js').World;
const Location=require('./world.js').Location;

const Enemys=require('./enemy.js');
const Enemy=Enemys.Enemy;
const Player=Enemys.Player;

let locations;
if(worldFile)locations=JSON.parse(worldFile);
let enemys;
if(enemysFile)enemys=JSON.parse(enemysFile);


world.sendId=(msg, id)=>{
	world.channels.fetch(world.fChannels[id]).then(channel => channel.send(msg));
};
world.sendIdc=(msg, id)=>{
	world.channels.fetch(id).then(channel => channel.send(msg));
};
world.send=(msg, player)=>{
	let chan=world.channels.cache.get(world.fChannels[player.location]);
	if(!chan)return;
	chan.send(msg);
};


world.map=new World(locations, enemys, world);
let map=world.map;

fs.readdir('./cmds-world/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) console.log("Нету комманд");
	console.log(`Загружено ${jsfiles.length} комманд`);
	jsfiles.forEach((f, i) => {
		let props = require(`./cmds-world/${f}`);
		console.log(`${i+1}.${f} Загружено!`);
		world.commands.set(props.help.name, props);
	});
});

world.on('ready', () => {
	console.log(`Регистрация под ${world.user.tag}`);
	world.generateInvite().then(link => {
		console.log(link);
	});
	for(chanID in world.fChannels){
		let chan=world.channels.cache.get(world.fChannels[chanID]);
		chan.bulkDelete(100).then(() =>{console.log(`Канал ${chan.name} очищен`)});
	}
	
});

rl.prompt();
let commands={
	help(){
		console.log('Commands:');
		console.log(Object.keys(commands));
	},
	location(name){
		console.log(map.getLoc(name));
	},
	enemy(id){
		console.log(map.getEnemy(id));
	},
	locations(){
		console.log(map.locations);
	},
	enemys(){
		console.log(map.enemys);
	},
	getConfig(){
		console.log(config);
	},
	consoleClear(){
		console.clear();
	},
	exit(){
		rl.close();
	}
};

rl.on('line', line=>{
	line=line.trim();
	let lineArray = line.split(" ");
	const command=commands[lineArray[0]];
	if(command)command(lineArray[1], line);
	else console.log('Не найдена комманда \''+line+'\'');
	rl.prompt();
}).on('close', ()=>{
	console.log('Бот выключен');
	process.exit(0);
});

world.login(token);

setInterval(()=>{
	let date=new Date();
	console.log("Обновление", '\x1b[35m', date.toLocaleDateString(), date.toLocaleTimeString(), '\x1b[0m');
	ii.update(world, enemys);
	world.channels.cache.get(world.fChannels['central']).guild.members.fetch().then(members=>{
		members.each(member=>{
			let player=map.getEnemy(member.user.id);
			for(channel in world.fChannels){
				if(channel==player.id || channel==player.location)world.channels.cache.get(world.fChannels[channel]).createOverwrite(member.user, {VIEW_CHANNEL: true});
				else world.channels.cache.get(world.fChannels[channel]).createOverwrite(member.user, {VIEW_CHANNEL: false});
			}
			if(!member.user.bot){
				let userName = member.user.username;
				let userID = member.user.id;
				let player=map.getEnemy(userID);
				let spawn=false;
				if(!player){
					spawn=true;
					console.log(`Спавн ${userName}`)
					map.spawnEnemy(new Player(userName, userID, world.map.locations[0]));
					player=world.map.getEnemy(userID);
					console.log(`Настройка прав каналов`)
					for(channel in world.fChannels){
						if(channel==player.id || channel=='central'){
							world.channels.cache.get(world.fChannels[channel]).createOverwrite(member.user, {VIEW_CHANNEL: true}, "Ready");
						}
					};
				};
				if(!world.fChannels[userID]){
					world.channels.cache.get(world.fChannels['central']).guild.channels.create(userName, {type:'text', parent:'754988552957460482'})
					.then(channel=>{
						world.fChannels[userID]=channel.id; 
						console.log("Новый канал игрока", channel.id);
						channel.createOverwrite(member.user, {VIEW_CHANNEL: true}, "Ready");
					}).catch(console.error);
				};
				if(spawn)world.send(`Поприветствуем нового игрока!\nОтныне **${player.name}** живет на этих землях!`, player);
			};
		});
	}).catch(console.error);
	map.locations.forEach(location=>{
		if(!world.fChannels[location.name]){
			let channelID=world.channels.cache.find(channel=>channel.name==location.name);
			channelID=channelID.id;
			world.fChannels[location.name]=channelID;
		}
	})
}, 5000);
setInterval(()=>{
	map.enemys.forEach(enemy=>{
		if(enemy.target && !map.enemys.find(target=>target.id==enemy.target && target.location==enemy.location)){
			if(enemy.type='player')world.sendId(`Вы потеряли свою цель`, enemy.id);
			enemy.target=null;
		}
		if(enemy.health<=0){
			world.emit('death', enemy);
			if(enemy.respawn){
				world.send(`**${enemy.name}** пал(а)`, enemy)
				enemy.location=enemy.spawnPoint;
				enemy.health=enemy.maxHealth;
				world.send(`**${enemy.name}** возродился!`, enemy);
				world.emit('respawn', enemy);
			}else{
				world.send(`**${enemy.name}** больше нету в мире живых`, enemy)
				map.deleteEnemy(enemy.id);
			}
		}
	})
	fs.writeFileSync("world.json", JSON.stringify(map.locations), (err)=>{if(err)throw err;});
	fs.writeFileSync("enemy.json", JSON.stringify(map.enemys), (err)=>{if(err)throw err;});
	fs.writeFileSync("channel-player.json", JSON.stringify(world.fChannels), (err)=>{if(err)throw err;});
}, 1000);
world.on('message', async message => {
	if (message.author.bot){
		setTimeout(()=>{message.delete();}, 60000);
		return;
	};
	world.send=(msg, player)=>{
		if(player){
			let chan=world.channels.cache.get(world.fChannels[player.location]);
			if(!chan)return;
			chan.send(msg);
		}else message.channel.send(msg);
	};
	let userName = message.author.username;
	let userID = message.author.id;
	let player=world.map.getEnemy(userID);
	if(!player){
		map.spawnEnemy(new Player(userName, userID, world.map.locations[0]));
		player=world.map.getEnemy(userID);
		for(channel in world.fChannels){
			if(channel==player.id || channel==player.spawnPoint)continue;
			world.channels.cache.get(world.fChannels[channel]).createOverwrite(message.author, {VIEW_CHANNEL: false}, "spawn");
		};
	};
	if(!world.fChannels[userID]){
		message.guild.channels.create(userName, {type:'text', parent:'754988552957460482'})
		.then(channel=>{world.fChannels[userID]=channel.id; console.log("Новый канал игрока", channel.id);}).catch(console.error);
	};
	world.map.clearDoubleEnemy(player.id);
	let messageArray = message.content.split(" ");
	let commandArray = messageArray[0].split("->");
	let command = commandArray[0];
	let args = commandArray;
	args.splice(0,1);
	let cmd = world.commands.get(command);
	if (cmd) {
		if(cv.commands)console.log(`!${userName}: ${message.content}`);
		cmd.run(world, message, args, player);
	}else if(cv.messages)console.log(`${userName}: ${message.content}`);
	message.delete();
});


//Создание локации
world.on('create-location', (location, player)=>{
	world.send(`**${player.name}** создал локацию **${location.name}**`, player);
});
//Удаление локации
world.on('delete-location', (name, player)=>{
	world.send(`**${player.name}** стер локацию **${name}**`, player);
});
//Движение существа
world.on('move-animal', (animal)=>{
	world.send(`Животное **${animal.name}**, пришло на эту локацию`, animal);
	map.enemys.forEach(enemy=>{
		if(enemy.target==animal.id){
			if(enemy.type='player')world.sendId(`Ваша цель ушла на другую локацию`, enemy.id);
			enemy.target=null;
		}
	})
});
world.on('move-player', (player)=>{
	world.send(`Игрок **${player.name}**, пришол на эту локацию`, player);
	map.enemys.forEach(enemy=>{
		if(enemy.target==player.id){
			if(player.type='player')world.sendId(`Ваша цель ушла на другую локацию`, enemy.id);
			enemy.target=null;
		}
	})
});
world.on('death', enemy=>{
	map.enemys.forEach(enemy2=>{
		if(enemy2.target==enemy.id){
			if(enemy2.type='player')world.sendId(`Ваша цель умерла`, enemy2.id);
			enemy2.target=null;
		}
	})
})
if(cv.actions){
	if(cv.actions.player){
		world.on('create-location', (location, player)=>console.log(`${player.name}: создал локацию '${location.name}'`))
		world.on('delete-location', (name, player)=>console.log(`${player.name}: удалил локацию '${name}'`))
	}if(cv.actions.events){
		world.on('move-animal', animal=>console.log(`${animal.name} перешло на локацию ${animal.location}`))
		world.on('move-player', player=>console.log(`${player.name} перешол на локацию ${player.location}`))
		world.on('death', enemy=>console.log(`${enemy.name} умер(ла)`))
	}
}