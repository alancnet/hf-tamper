const tree = require('./tree')
const walk = require('./walk')

const THREE = require('./three')

window.bake = () => {
  const baker = new THREE.Baker();
  baker.parse(CK.characters[0].characterDisplay.threeObj);
  console.log('Baked');
}
window.save = (filename) => {
  const exporter = new THREE.GLTFExporter();
  exporter.parse(CK.characters[0].characterDisplay.threeObj, data => {
    window.data = data;
    console.log('done')
    if (filename) console.save(JSON.stringify(window.data), `${filename}.gltf`)
  })
}

// Your code here...