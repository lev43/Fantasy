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
		this.aggression=0;
	}
}
class Animal extends Enemy{
	constructor(name, id, max_health, damage, spawn_location, respawn, aggression, concentration, speed){
		super(name, id, max_health, spawn_location, "animal");
		this.respawn=respawn;
		this.damage=damage;
		this.speed=speed;		
		this.aggression=aggression;
		this.concentration=concentration;
	}
}
class Monster extends Animal{
	constructor(name, id, max_health, damage, spawn_location, respawn, aggression, concentration, speed){
		super(name, id, max_health, damage, spawn_location, respawn, aggression, concentration, speed);
		this.type='monster';
	}
}
class Player extends Enemy{
	constructor(name, id, spawn_location){
		super(name, id, 100, spawn_location, "player", false);
		this.concentration=50;
		this.damage=5;
		this.respawn=false;
	}
}

module.exports={
	Enemy: Enemy,
	Player: Player,
	Animal: Animal,
	Monster: Monster
};