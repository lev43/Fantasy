const enemy = require('./enemy.js');

function random(min=0, max=999999){
    let rand=Math.round(Math.random()*max+min);
    return rand;
}
const Animal=enemy.Animal;
class ii{
    update(world, enemys){
        let animals=enemys.filter(enemy=>enemy.bot);
        console.log('Решение действий животных');
        for(let i=0;i<animals.length;i++){
            switch(animals[i].type){
                case 'animal':
                    this.animal(animals[i], world);
                    break;
                case 'monster':
                    this.monster(animals[i], world)
                    break
            }
        }
    }
    animal(animal, world){
        if(random(0, 100)<animal.speed){
            let direction=world.map.getLoc(animal.location);
            direction=direction.pass[random(0, direction.pass.length-1)];
            world.map.moveEnemy(animal, direction);
            world.emit('move-animal', animal);
        }
    }
    monster(monster, world){
        if(random(monster.aggression, 100)>99){
            if(!monster.target || random(0, 100)>monster.concentration){
                world.emit('target-monster-start', monster);
                let enemys=world.map.enemys.filter(enemy=>enemy.location==monster.location && enemy.id!=monster.id)
                if(enemys.length>0){
                    monster.target=enemys[random(0, enemys.length-1)].id;
                    world.emit('target-monster-end', monster.target, monster)
                }else world.emit('target-monster-end', false, monster)
            }
        }
        if(random(0, 100)<monster.aggression)
            if(monster.target){
            let target=world.map.enemys.find(enemy=>enemy.id==monster.target);
            if(target.type=='player')
                world.sendId(`Вас атакует **${monster.name}**`, target.id);
            target.health-=monster.damage;
        }
        if(random(0, 100)<monster.speed){
            let direction=world.map.getLoc(monster.location);
            direction=direction.pass[random(0, direction.pass.length-1)];
            world.map.moveEnemy(monster, direction);
            world.emit('move-animal', monster);
        }
    }
    monsterMove(monster, world, direction){
        world.map.moveEnemy(monster, direction);
        world.emit('move-animal', monster);
    }
}

module.exports=new ii;