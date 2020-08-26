class Enemy{
	constructor(id, name, health, location_spawn){
		this.name=String(name);
		this.health=parseInt(health);
		this.spawnPoint=location_spawn;
		this.location=location_spawn;
		this.id=id;
	}
}