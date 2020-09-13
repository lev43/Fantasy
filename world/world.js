class Location{
	constructor(name="NULL", size=0){
		this.name=String(name);
		this.size=parseInt(size);
		this.pass=[];
	}
	s(){
		this.name=String(this.name);
		this.size=parseInt(this.size);
		if(this.size==NaN || this.size==undefined)this.size=0;
	}
};

class World{
	constructor(locations, enemys){
		this.locations=new Array();
		this.enemys=new Array();
		if(locations)this.locations=locations;
		else this.locations[0]=new Location("central", 50);
		if(enemys)this.enemys=enemys;
	}
	addLoc=function(location){
		this.locations.push(location);
	}
	getLoc(name){
		for(let i=0;i<this.locations.length;i++)
			if(this.locations[i].name==name)return this.locations[i];
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
		for(let i=0;i<this.enemys.length;i++)
			if(this.enemys[i].id==id)return this.enemys[i];
		return false;
	}
	deleteEnemy(id){
		for(let i=0;i<this.enemys.length;i++)
			if(this.enemys[i].id==id){
				this.enemys.splice(i, 1);
				return true;
			};
		return false;
	}
	clearDoubleEnemy(){
		if(this.enemys.length<1)return;
		let doubleEnemys=true;
		let i=0;
		while(doubleEnemys){
			let doubleEnemy=0;
			let id=this.enemys[i].id;
			for(let j=0;j<this.enemys.length;j++)
				if(this.enemys[j].id==id)doubleEnemy++;
			if(doubleEnemy>1)for(let j=0;j<doubleEnemy;j++)
				this.deleteEnemy(id);
			i++;
			if(i>=this.enemys.length)doubleEnemys=false;
		};
	}
	spawnEnemy(enemy){
		this.enemys.push(enemy);
	}
	moveEnemy(enemy, direction){
		if(this.getLoc(direction)){
			enemy.location=direction;
			return true;
		}else return false;
	}
};

module.exports={
	Location: Location,
	World: World
};