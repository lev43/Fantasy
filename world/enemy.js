class Enemy{
	constructor(name, id, spawn_location, speed){
		this.name=String(name);
		this.id=id;
		this.spawnPoint=spawn_location.name;
		this.location=spawn_location.name;
		this.speed=speed;
		spawn_location.enemys[spawn_location.enemys.length]=this;
	}
}

class Player extends Enemy{
	constructor(name, id, spawn_location, speed){
		super(name, id, spawn_location, speed);
	}
}

module.exports={
	Enemy: Enemy,
	Player: Player
};