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
            }
        }
    }
    animal(animal, world){
        let direction=world.map.getLoc(animal.location);
        direction=direction.pass[random(0, direction.pass.length-1)];
        switch(random(0, 6)){
            case 1:
                let location=animal.location;
                world.map.moveEnemy(animal, direction);
                world.emit('move-animal', animal);
                break;
        }
    }
}

module.exports=new ii;