class Location{
	constructor(name="NULL", size=0){
		this.name=String(name);
		this.size=parseInt(size);
		this.pass=[];
		this.enemys=[];
	}
	s(){
		this.name=String(this.name);
		this.size=parseInt(this.size);
		if(this.size==NaN || this.size==undefined)this.size=0;
	}
};

class World{
	constructor(locations){
		this.locations=new Array();
		if(locations)this.locations=locations;
		else this.locations[0]=new Location("central", 50);
	}
	addLoc=function(location){
		this.locations.push(location);
	}
	getLoc(name){
		for(let i=0;i<this.locations.length;i++)
			if(this.locations[i].name=name)return this.locations[i];
		return false;
	}
	deleteLoc(name){
		for(let i=0;i<this.locations.length;i++)
			if(this.locations[i].name=name){
				this.locations.splice(i, 1);
				return true;
			};
		return false;
	}
	getEnemy(id){
	}
	deleteEnemy(id){
	}
	clearDoubleEnemy(id){
	}
	moveEnemy(world, enemy, direction){
	}
};

module.exports={
	Location: Location,
	World: World
};