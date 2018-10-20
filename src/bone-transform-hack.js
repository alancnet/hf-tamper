THREE.SkinnedMesh.prototype.boneTransform = (function() {

  var clone = new THREE.Vec3(),
    result = new THREE.Vec3(),
    skinIndices = new THREE.Vec4(),
    skinWeights = new THREE.Vec4();
  var temp = new THREE.Vec3(),
    tempMatrix = new THREE.Matrix4(),
    properties = ['x', 'y', 'z', 'w'];

  return function(vertex, index) {

    if (this.geometry instanceof THREE.BufferGeometry) {

      var index4 = index * 4;
      skinIndices.fromArray(this.geometry.attributes.skinIndex.array, index4);
      skinWeights.fromArray(this.geometry.attributes.skinWeight.array, index4);

    } else if (this.geometry instanceof THREE.Geometry) {

      skinIndices.copy(this.geometry.skinIndices[index]);
      skinWeights.copy(this.geometry.skinWeights[index]);

    }

    var clone = vertex.clone().applyMatrix4(this.bindMatrix);
    result.set(0, 0, 0);

    for (var i = 0; i < 4; i++) {

      var skinWeight = skinWeights[properties[i]];

      if (skinWeight != 0) {

        var boneIndex = skinIndices[properties[i]];
        tempMatrix.multiplyMatrices(this.skeleton.bones[boneIndex].matrixWorld, this.skeleton.boneInverses[boneIndex]);
        result.add(temp.copy(clone).applyMatrix4(tempMatrix).multiplyScalar(skinWeight));

      }

    }

    return clone.copy(result.applyMatrix4(this.bindMatrixInverse));

  };

})();
// Export scripts
