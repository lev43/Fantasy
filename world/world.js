const enemy = require("./enemy");

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
		else this.addLoc(new Location("центральная-площадь", 50));
		if(enemys)this.enemys=enemys;
	}
	addLoc=function(location){
		if(!this.getLoc(location.name)){
			this.locations.push(location);
			return true;
		};
		return false;
	}
	getLoc(name, search_in_the_aisles=false, location='NULL'){
		location=this.locations.find(loc=>loc.name==location);
		if(search_in_the_aisles && location.pass.find(loc=>loc==name)==undefined)return false;
		else return this.locations.find(loc=>loc.name==name);
	}
	deleteLoc(name){
		for(let i=0;i<this.locations.length;i++)
			if(this.locations[i].name==name){
				let loc=this.locations[i];
				for(let j=0;j<this.enemys.length;j++)
					if(this.enemys){
						if(this.enemys[j].spawnPoint==name){
							this.deleteEnemy(this.enemys[j].id);
						}
						if(this.enemys[j].location==name){
							this.enemys[j].location=this.enemys[j].spawnPoint;
						}
					}
				this.locations.splice(i, 1);
				for(let j=0;j<loc.pass.length;j++){
					let loce=this.getLoc(loc.pass[j]);
					for(let t=0;t<loce.pass.length;t++){
						if(loce.pass[t]==name){
							loce.pass.splice(t,1);
							break;
						};
					};
				};
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
		if(this.getLoc(direction, true, enemy.location)){
			enemy.location=direction;
			return true;
		}else return false;
	}
};

module.exports={
	Location: Location,
	World: World
};