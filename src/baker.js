const { slices, pushAll } = require('./array')
const {toStl, rotate} = require('./stl')

const THREE = require('./three')

const transformedSkinVertex = require('./transformed-skin-vertex')


THREE.Baker = function() {};

THREE.Baker.prototype = {

  constructor: THREE.Baker,

  parse: (function() {

    var vector = new THREE.Vec3();
    var normalMatrixWorld = new THREE.Matrix3();

    return function parse(scene, options) {

      if (options === undefined) options = {};

      var binary = options.binary !== undefined ? options.binary : false;

      //

      var objects = [];
      var triangles = [];
      const _triangles = triangles

      scene.traverse(function(object) {

        if (object.isMesh) {

          if (object.pose && object.skeleton && typeof(object.skeleton.pose) == 'function') {
            console.log('Posing object', object)
            //object.pose();
          }
          if (object.geometry && object.geometry.attributes) {
            object.geometry.attributes._geometry = object.geometry
            object.geometry.attributes._object = object
            console.log(object.geometry.attributes)
          }
          var og = object.geometry;
          var geometry = object.geometry;
          /* FROM */

          let positions, triangles, skinIndices, skinWeights
          if (geometry instanceof THREE.BufferGeometry) {
            var a, b, c;
            var index = geometry.index;
            var attributes = geometry.attributes;

            // Figure out where each triangle is supposed to be, globally.
            positions = slices(attributes.position.array, 3).map(([x, y, z]) => new THREE.Vec3(x, y, z));
            triangles = index
            ? slices(Array.from(index.array).map(i => positions[i]), 3)
            : slices(positions, 3)

            if (attributes.skinIndex) {
              skinIndices = slices(Array.from(attributes.skinIndex.array), 4)
              skinWeights = slices(attributes.skinWeight.array, 4)
            }  

          } else if (geometry instanceof THREE.Geometry) {
            console.log('GEOMETRY')

            positions = geometry.vertices.map(v => v.clone())
            triangles = geometry.faces.map(({a, b, c}) => [
              positions[a],
              positions[b],
              positions[c]
            ])
            if (object.geometry.skinIndices) {
              skinIndices = object.geometry.skinIndices.map(({x, y, z, w}) => [x, y, z, w])
              skinWeights = object.geometry.skinWeights.map(({x, y, z, w}) => [x, y, z, w])
            }  

            {
  /*
            var fvA, fvB, fvC;
            //var isFaceMaterial = material instanceof THREE.MultiMaterial;
            //var materials = isFaceMaterial === true ? material.materials : null;

            var vertices = geometry.vertices;
            var faces = geometry.faces;
            var faceVertexUvs = geometry.faceVertexUvs[0];
            if (faceVertexUvs.length > 0) uvs = faceVertexUvs;

            for (var f = 0, fl = faces.length; f < fl; f++) {

              var face = faces[f];
              //var faceMaterial = isFaceMaterial === true ? materials[ face.materialIndex ] : material;

              //if ( faceMaterial === undefined ) continue;

              fvA = vertices[face.a];
              fvB = vertices[face.b];
              fvC = vertices[face.c];

              / *
              if ( faceMaterial.morphTargets === true ) {

                  var morphTargets = geometry.morphTargets;
                  var morphInfluences = this.morphTargetInfluences;

                  vA.set( 0, 0, 0 );
                  vB.set( 0, 0, 0 );
                  vC.set( 0, 0, 0 );

                  for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

                      var influence = morphInfluences[ t ];

                      if ( influence === 0 ) continue;

                      var targets = morphTargets[ t ].vertices;

                      vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
                      vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
                      vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

                  }

                  vA.add( fvA );
                  vB.add( fvB );
                  vC.add( fvC );

                  fvA = vA;
                  fvB = vB;
                  fvC = vC;

              }
              * /

              // if (this.boneTransform) {
              //   console.log('YES')
              //   fvA = this.boneTransform(fvA, face.a);
              //   fvB = this.boneTransform(fvB, face.b);
              //   fvC = this.boneTransform(fvC, face.c);

              // }



            }
*/
            }
          } else {
            console.log(geometry && geometry.constructor.name || 'Non-Geo')
          }

          let o = object
          // positions.forEach((p, i) => {
          //   p.applyMatrix4(object.matrixWorld)
          // })
          if (skinIndices) {
            // const skinIndices = object.geometry.skinIndices.map(({x, y, z, w}) => [x, y, z, w])
            // const skinWeights = object.geometry.skinWeights.map(({x, y, z, w}) => [x, y, z, w])
            const bones = object.skeleton.bones

            positions.forEach((p, index) => {

              var skinIndex = skinIndices[index]
              var skinWeight = skinWeights[index]
              const skinVertex = p.clone().applyMatrix4(object.bindMatrix)
              //var skinVertex = positions[index].applyMatrix4(object.bindMatrix)
              //(new THREE.Vector3 ()).fromAttribute (skin.geometry.getAttribute ('position'), index).applyMatrix4 (skin.bindMatrix);
              var result = new THREE.Vector3 ()
              var temp = new THREE.Vector3 ()
              var tempMatrix = new THREE.Matrix4 ()
              var properties = ['x', 'y', 'z', 'w'];
              for (var i = 0; i < 4; i++) {
                  var boneIndex = skinIndex[i];
                  if (boneIndex >= 0) {
                    tempMatrix.multiplyMatrices (object.skeleton.bones[boneIndex].matrixWorld, object.skeleton.boneInverses[boneIndex]);
                    //result.add (temp.copy (skinVertex).multiplyScalar (skinWeights[properties[i]]).applyMatrix4 (tempMatrix));
                    //result.add (temp.copy (skinVertex).applyMatrix4 (tempMatrix).multiplyScalar (skinWeight[i]));
                    result.add(skinVertex.clone().applyMatrix4(tempMatrix).multiplyScalar(skinWeight[i]))
                  }
            
              }
              result.applyMatrix4(object.bindMatrixInverse)

              p.copy(result)
              //return result.applyMatrix4 (skin.bindMatrixInverse);
            
              // const skinIndex = skinIndices[i]
              // const skinWeight = skinWeights[i]
              // skinIndex.forEach((s, j) => {
              //   //https://stackoverflow.com/questions/31620194/how-to-calculate-transformed-skin-vertices
              //   //result.add (temp.copy (skinVertex).applyMatrix4 (tempMatrix).multiplyScalar (skinWeights[properties[i]]));


              //   const w = skinWeight[j]
              //   const bone = bones[s]
              //   if (bone) {
              //     p.add(p.clone().applyMatrix4(bone.matrixWorld).multiplyScalar(w))
              //   }
              // })
            })

          }
          

          // attributes.position is a flattened Array<Array<Vector3>>.
          // attributes.skinIndex is a flattened Array<Array(4)<Int>>. Each is an ordinal to a bone.
          // attributes.skinWeight is a flattened Array<Array(4)<Float>>. Each is a 0.0 - 1.0 weight for a bone.


          // if (attributes.skinIndex) {
          //   const skinIndex = attributes.skinIndex
          //   const skinWeight = attributes.skinWeight

          //   const bones = object.skeleton.bones
          //   const bonesPerPosition = slices(Array.from(skinIndex.array).map(i => bones[i]), 4)
          //   const weightsPerPosition = slices(skinWeight.array, 4)
          //   positions.forEach((p, i) => {
          //     const bones = bonesPerPosition[i]
          //     const weights = weightsPerPosition[i]
          //     bones.forEach((bone, b) => {
          //       const weight = weights[b]
          //       if (weight !== 0) {
          //         const matrix = bone.matrix.clone().multiply(object.matrixWorld)
          //         //matrix.multiplyScalar(weight)
          //         p.applyMatrix4(matrix)
          //       }
          //     })
          //   })
          // }


          pushAll(_triangles, triangles)

          /* END FROM*/
        }

      });

      console.log('Triangles', triangles)
      const stl = toStl(rotate(triangles))
      window.save = (filename) => console.save(stl, filename || 'export.stl')
      console.log('save([filename]) to save')
    };

  }())

};
