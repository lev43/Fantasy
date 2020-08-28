class Location{
	constructor(name="NULL", size=0){
		this.name=String(name);
		this.size=parseInt(size);
		this.locations=[];
		this.enemys=[];
		this.see="";
	}
	s(){
		this.name=String(this.name);
		this.size=parseInt(this.size);
	}
	integrityCheck(){
		if(typeof this.name!="string")return false;
		if(typeof this.size!="number")return false;
		return true;
	}
};

class World{
	constructor(locations){
		this.locations=new Array();
		if(locations)this.locations=locations;
		else this.locations[0]=new Location("central", 50);
	}
};
class WorldManager{
	addLocation(locations, location){
		locations.locations[locations.locations.length]=location;
	}
	getLocation(map, name){
		for(let i=0;i<map.length;i++){
			if(map[i].name===name )return map[i];
			if(map[i].locations){
				let n=this.getLocation(map[i].locations, name);
				if(n)return n;
			};
		};
		return false;
	}
	deleteLocation(map, name){
		let g;
		for(let i=0;i<map.length;i++){
			if(map[i].name===name){
				map.splice(i, 1);
				return true;
			};
			if(map[i].locations)g=this.deleteLocation(map[i].locations, name);
		};
		return g;
	}
	getEnemy(map, id){
		for(let i=0;i<map.length;i++){
			for(let j=0;j<map[i].enemys.length;j++){
				if(map[i].enemys[j].id===id)return map[i].enemys[j];
				if(map[i].locations){
					let n=this.getEnemy(map[i].locations, id);
					if(n)return n;
				};
			};
		};
		return false;
	}
	moveEnemy(world, enemy, direction){
		let loc=this.getLocation(world.map.locations, enemy.location);
		let f=(map, enemy)=>{
			for(let i=0;i<map.length;i++){
				for(let j=0;j<map[i].enemys.length;j++){
					if(map[i].enemys[j].id==enemy.id){
						map[i].enemys.splice(j, 1);
						return true;
					};
					if(map[i].locations)g=f(map[i].locations, enemy);
				};
			};
			return g;
		};
		enemy.location=direction.name;
		direction.enemys[direction.enemys.length]=enemy;
		world.emit("move", enemy, loc);
	}
};

module.exports={
	Location: Location,
	World: World,
	WorldManager: new WorldManager
};