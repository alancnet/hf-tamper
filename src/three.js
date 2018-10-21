const THREE = window.THREE || RK;
THREE.Vector3 = THREE.Vec3 || THREE.Vector3;
THREE.Vec3 = THREE.Vector3;

// Add default .toString() functions to display the type, name, and ID.
Object.keys(THREE).forEach(key => {
  const Type = THREE[key]
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