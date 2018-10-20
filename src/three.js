const THREE = RK;
THREE.Vector3 = THREE.Vec3;

// Add default .toString() functions to display the type, name, and ID.
Object.keys(RK).forEach(key => {
  const Type = RK[key]
  if (Type && Type.prototype && !Type.prototype.hasOwnProperty('toString')) {
    Type.prototype.toString = function() {
      const description = [key, this.name, this.id].filter(x => x === 0 || x).join(' ')
      return `[${description}]`
    }
  }
})

module.exports = THREE
require('./gltf-exporter')
require('./stl-exporter')
require('./baker')