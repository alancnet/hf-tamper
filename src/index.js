const tree = require('./tree')
const walk = require('./walk')

const THREE = require('./three')

window.character = window.CK && CK.characters[0].characterDisplay.threeObj
window.character = window.character || scene.children[4]

if (window.scene) {
  var i = -6
  scene.traverse(o => {
    o.name = o.type + i++
  })
  scene.getObjectByName('Bone3').rotation.z = 32  
}

window.bake = () => {
  const baker = new THREE.Baker();
  baker.parse(character);
  console.log('Baked');
}
window.save = (filename) => {
  const exporter = new THREE.GLTFExporter();
  exporter.parse(character, data => {
    window.data = data;
    console.log('done')
    if (filename) console.save(JSON.stringify(window.data), `${filename}.gltf`)
  })
}

// Your code here...