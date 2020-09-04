class Location{
	constructor(name="NULL", size=0, parent="NULL"){
		this.name=String(name);
		this.size=parseInt(size);
		this.parent=parent;
		this.enemys=[];
		this.locations=[];
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
	addLocation(location, parent){
		location.parent=parent.name;
		parent.locations.push(location);
	}
	getLocation(name){
		let loc=true;
		let map=this.locations;
		while(loc){
			loc=false;
			for(let i=0;i<map.length;i++){
				if(map[i].name==name )return map[i];
				if(map[i].locations){
					map=map[i].locations;
					loc=true;
				};
			};
		};
		return false;
	}
	deleteLocation(name){
		let loc=true;
		let map=this.locations;
		while(loc){
			loc=false;
			for(let i=0;i<map.length;i++){
				if(map[i].name==name){
					map.splice(i, 1);
					return true;
				};
				if(map[i].locations){
					map=map[i].locations;
					loc=true;
				};
			};
		};
		return false;
	}
	getEnemy(id){
		let loc=true;
		let map=this.locations;
		while(loc){
			loc=false;
			for(let i=0;i<map.length;i++){
				for(let j=0;j<map[i].enemys.length;j++){
					if(map[i].enemys[j].id==id )return map[i].enemys[j];
				};
				if(map[i].locations){
					map=map[i].locations;
					loc=true;
				};
			};
		};
		return false;
	}
	deleteEnemy(id){
		let loc=true;
		let map=this.locations;
		while(loc){
			loc=false;
			for(let i=0;i<map.length;i++){
				for(let j=0;j<map[i].enemys.length;j++){
					if(map[i].enemys[j].id==id ){
						map[i].enemys.splice(j, 1);
						return true;
					};
				};
				if(map[i].locations){
					map=map[i].locations;
					loc=true;
				};
			};
		};
		return false;
	}
	clearDoubleEnemy(id){
		let enemys=0;
		let loc=true;
		let map=this.locations;
		while(loc){
			loc=false;
			for(let i=0;i<map.length;i++){
				for(let j=0;j<map[i].enemys.length;j++){
					if(map[i].enemys[j].id==id ){
						enemys++;
					};
				};
				if(map[i].locations){
					map=map[i].locations;
					loc=true;
				};
			};
		};
		for(let i=enemys;i>1;i--){
			this.deleteEnemy(id);
		};
	}
	moveEnemy(world, enemy, direction){
		enemy.location=direction.name;
		direction.enemys.push(enemy);
		world.emit("move", enemy, direction);
		this.deleteEnemy(enemy.id);
	}
};
class WorldManager{
	
};

module.exports={
	Location: Location,
	World: World
};