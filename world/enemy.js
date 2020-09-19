class Enemy{
	constructor(name, id, spawn_location, type){
		this.type=type;
		this.name=String(name);
		this.id=id;
		this.spawnPoint=spawn_location.name;
		this.location=spawn_location.name;
	}
}
class Monster extends Enemy{
	constructor(name, id, spawn_location){
		super(name, id, spawn_location, "monster");
	}
	action(){
		
	}
}
class Player extends Enemy{
	constructor(name, id, spawn_location){
		super(name, id, spawn_location, "player");
	}
}

module.exports={
	Enemy: Enemy,
	Player: Player,
	Monster: Monster
};