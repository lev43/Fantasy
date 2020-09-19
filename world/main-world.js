const Discord = require('discord.js');
const world = new Discord.Client();
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


world.map=new World(locations, enemys, world);
let map=world.map;

fs.readdir('./cmds-world/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) console.log("not commands");
	console.log(`Loaded ${jsfiles.length} command(s)`);
	jsfiles.forEach((f, i) => {
		let props = require(`./cmds-world/${f}`);
		console.log(`${i+1}.${f} Loaded!`);
		world.commands.set(props.help.name, props);
	});
});

world.on('ready', () => {
	console.log(`Logged in as ${world.user.tag}!`);
	world.generateInvite().then(link => {
		console.log(link);
	});
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
	console.log('Bot close');
	process.exit(0);
});

world.login(token);

world.on('message', async message => {
	if (message.author.bot){
		setTimeout(()=>{message.delete();}, 300000);
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
		.then(channel=>{world.fChannels[userID]=channel.id; console.log("new channel player!", channel.id);}).catch(console.error);
	};
	world.map.clearDoubleEnemy(player.id);
	let messageArray = message.content.split(" ");
	let commandArray = messageArray[0].split("->");
	let command = commandArray[0];
	let args = commandArray;
	args.splice(0,1);
	let cmd = world.commands.get(command);
	if (cmd) {
		cmd.run(world, message, args, player);
	};
	message.delete();
	fs.writeFileSync("world.json", JSON.stringify(map.locations), (err)=>{if(err)throw err;});
	fs.writeFileSync("enemy.json", JSON.stringify(map.enemys), (err)=>{if(err)throw err;});
	fs.writeFileSync("channel-player.json", JSON.stringify(world.fChannels), (err)=>{if(err)throw err;});
});


//Создание локации
world.on('create-location', (location, player)=>{
	world.send(`**${player.name}** создал локацию **${location.name}**`, player);
});
//Удаление локации
world.on('delete-location', (name, player, message)=>{
	world.send(`**${player.name}** стер локацию **${name}**`, player);
});