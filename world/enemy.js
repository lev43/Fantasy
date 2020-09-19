class Enemy{
	constructor(name, id, spawn_location){
		this.name=String(name);
		this.id=id;
		this.spawnPoint=spawn_location.name;
		this.location=spawn_location.name;
	}
}

class Player extends Enemy{
	constructor(name, id, spawn_location){
		super(name, id, spawn_location);
	}
}

module.exports={
	Enemy: Enemy,
	Player: Player
};