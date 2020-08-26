const Discord  = module.require("discord.js");
const fs = require("fs");
let commands = new Discord.Collection();

fs.readdir('./cmds-world/delete/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) console.log("not commands");
	console.log(`Loaded ${jsfiles.length} delete->command(s)`);
	jsfiles.forEach((f, i) => {
		let props = require(`../cmds-world/delete/${f}`);
		console.log(`${i+1}.delete->${f} Loaded!`);
		commands.set(props.help.name, props);
	});
});

module.exports.run = async (world, message, args) => {
	let cmd = commands.get(args[0]);
	if (cmd) {
		args.splice(0,1);
		cmd.run(world, message, args);
	};
};
module.exports.help = {
	name: "delete"
};