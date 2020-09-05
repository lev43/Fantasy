const Discord = require('discord.js');
const world = new Discord.Client();
world.commands = new Discord.Collection();
const fs = require('fs');
let config = require('./botconfig.json');
let token = config.world;

let worldFile=fs.readFileSync("world.json", "utf8");
const World=require('./world.js').World;
const Location=require('./world.js').Location;

const Enemys=require('./enemy.js');
const Enemy=Enemys.Enemy;
const Player=Enemys.Player;

let locations;
if(worldFile)locations=JSON.parse(worldFile);

world.map=new World(locations);
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
world.login(token);

world.on('message', async message => {
	if (message.author.bot) return;
	world.send=(msg)=>{message.channel.send(msg);};
	let userName = message.author.username;
	let userID = message.author.id;
	let player=world.map.getEnemy(userID);
	if(!player)player=new Player(userName, userID, world.map.locations[0], 1);
	world.map.clearDoubleEnemy(player.id);
	let messageArray = message.content.split(" ");
	for(let i=0;i<messageArray.length;i++){
		let commandArray = messageArray[i].split("->");
		let command = commandArray[0];
		let args = commandArray;
		args.splice(0,1);
		let cmd = world.commands.get(command);
		if (cmd) {
			cmd.run(world, message, args, player);
		};
	};
	fs.writeFileSync("world.json", JSON.stringify(map.locations), (err)=>{if(err)throw err;});
});
