var transformedSkinVertex = function (skin, index) {
  var skinIndices = (new THREE.Vector4 ()).fromAttribute (skin.geometry.getAttribute ('skinIndex'), index);
  var skinWeights = (new THREE.Vector4 ()).fromAttribute (skin.geometry.getAttribute ('skinWeight'), index);
  var skinVertex = (new THREE.Vector3 ()).fromAttribute (skin.geometry.getAttribute ('position'), index).applyMatrix4 (skin.bindMatrix);
  var result = new THREE.Vector3 ()
  var temp = new THREE.Vector3 ()
  var tempMatrix = new THREE.Matrix4 ()
  var properties = ['x', 'y', 'z', 'w'];

  for (var i = 0; i < 4; i++) {
      var boneIndex = skinIndices[properties[i]];
      tempMatrix.multiplyMatrices (skin.skeleton.bones[boneIndex].matrixWorld, skin.skeleton.boneInverses[boneIndex]);
      //result.add (temp.copy (skinVertex).multiplyScalar (skinWeights[properties[i]]).applyMatrix4 (tempMatrix));
      result.add (temp.copy (skinVertex).applyMatrix4 (tempMatrix).multiplyScalar (skinWeights[properties[i]]));

  }
  return result.applyMatrix4 (skin.bindMatrixInverse);
};

module.exports = transformedSkinVertex