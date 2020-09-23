class Enemy{
	constructor(name='NULL', id=NaN, max_health, spawn_location='NULL', type='enemy', bot=true){
		this.type=type;
		this.bot=bot;
		this.respawn=false;
		this.name=String(name);
		this.id=id;
		this.maxHealth=max_health;
		this.health=max_health;
		this.spawnPoint=spawn_location.name;
		this.location=spawn_location.name;
		this.concentration=0;
		this.target=null;
		this.damage=0;
	}
}
class Animal extends Enemy{
	constructor(name, id, max_health, spawn_location, respawn){
		super(name, id, max_health, spawn_location, "animal");
		this.respawn=respawn;
	}
}
class Player extends Enemy{
	constructor(name, id, spawn_location){
		super(name, id, 100, spawn_location, "player", false);
		this.concentration=50;
		this.damage=5;
		this.respawn=true;
	}
}

module.exports={
	Enemy: Enemy,
	Player: Player,
	Animal: Animal
};