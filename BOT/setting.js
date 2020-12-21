var propertiesReader = require('properties-reader');

let properties = propertiesReader('./DATA/DATA.properties');
let propertiesI = Object.keys(properties.path())
global.DATA={}
for(let i=0;i<propertiesI.length;i++){
  global.DATA[propertiesI[i]]=properties.path()[propertiesI[i]]
}

properties = propertiesReader(global.DATA.setting);
propertiesI = Object.keys(properties.path())


for(let i=0;i<propertiesI.length;i++){
  global.setting[propertiesI[i]]=properties.path()[propertiesI[i]]
}