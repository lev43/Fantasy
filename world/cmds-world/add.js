const Discord  = module.require("discord.js");
const fs = require("fs");
let commands = new Discord.Collection();

fs.readdir('./cmds-world/add/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) console.log("Нету комманд");
	console.log(`Загружено ${jsfiles.length} комманд add`);
	jsfiles.forEach((f, i) => {
		let props = require(`../cmds-world/add/${f}`);
		console.log(`${i+1}.add->${f} Загружено!`);
		commands.set(props.help.name, props);
	});
});

module.exports.run = async (world, message, args, player) => {
	if(!message.member.hasPermission("ADMINISTRATOR"))return;
	let cmd = commands.get(args[0]);
	if (cmd) {
		args.splice(0,1);
		cmd.run(world, message, args, player);
	};
};
module.exports.help = {
	name: "add"
};