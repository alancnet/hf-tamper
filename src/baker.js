const THREE = require('./three')

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
      var triangles = 0;

      scene.traverse(function(object) {

        if (object.isMesh) {

          if (object.pose && object.skeleton && typeof(object.skeleton.pose) == 'function') {
            console.log('Posing object', object)
            object.pose();
          }
          console.log(object)
          var og = object.geometry;
          var geometry = object.geometry;
          /* FROM */

          function checkBufferGeometryIntersection(object, positions, uvs, a, b, c) {
            var inverseMatrix = new THREE.Matrix4();
            var ray = new THREE.Ray();
            var sphere = new THREE.Sphere();

            var vA = new THREE.Vec3();
            var vB = new THREE.Vec3();
            var vC = new THREE.Vec3();

            var tempA = new THREE.Vec3();
            var tempB = new THREE.Vec3();
            var tempC = new THREE.Vec3();

            var uvA = new THREE.Vec2();
            var uvB = new THREE.Vec2();
            var uvC = new THREE.Vec2();

            var barycoord = new THREE.Vec3();

            var intersectionPoint = new THREE.Vec3();
            var intersectionPointWorld = new THREE.Vec3();
            vA.fromArray(positions, a * 3);
            vB.fromArray(positions, b * 3);
            vC.fromArray(positions, c * 3);

            if (object.boneTransform) {

              vA = object.boneTransform(vA, a);
              vB = object.boneTransform(vB, b);
              vC = object.boneTransform(vC, c);

            }
          }
          var uvs, intersection;

          if (geometry instanceof THREE.BufferGeometry) {
            debugger;
            console.log('BUFFER')
            var a, b, c;
            var index = geometry.index;
            var attributes = geometry.attributes;
            var positions = attributes.position.array;

            if (attributes.uv !== undefined) {

              uvs = attributes.uv.array;

            }

            if (index !== null) {

              var indices = index.array;

              for (var i = 0, l = indices.length; i < l; i += 3) {

                a = indices[i];
                b = indices[i + 1];
                c = indices[i + 2];

                intersection = checkBufferGeometryIntersection(this, positions, uvs, a, b, c);

                if (intersection) {

                  intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
                  intersects.push(intersection);

                }

              }

            } else {


              for (var i = 0, l = positions.length; i < l; i += 9) {

                a = i / 3;
                b = a + 1;
                c = a + 2;

                intersection = checkBufferGeometryIntersection(this, positions, uvs, a, b, c);

                if (intersection) {

                  intersection.index = a; // triangle number in positions buffer semantics
                  intersects.push(intersection);

                }

              }

            }

          } else if (geometry instanceof THREE.Geometry) {
            console.log('GEOMETRY')
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

              /*
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
              */

              if (this.boneTransform) {
                console.log('YES')
                fvA = this.boneTransform(fvA, face.a);
                fvB = this.boneTransform(fvB, face.b);
                fvC = this.boneTransform(fvC, face.c);

              }



            }

          } else {
            console.log(geometry && geometry.constructor.name || 'Non-Geo')
          }


          /* END FROM*/

          if (geometry.isBufferGeometry) {
            geometry = new THREE.Geometry().fromBufferGeometry(geometry);
          }


          /*
          if ( geometry.isGeometry ) {
              if (object.skeleton) {
                  const allBones = object.skeleton.bones;
                  const position = Array.from(og.attributes.position.array);
                  const skinWeight = Array.from(og.attributes.skinWeight.array);
                  const skinIndex = Array.from(og.attributes.skinIndex.array);
                  // "loop each vert"
                  geometry.vertices.forEach((v, i) => {
                      const p = i * 3;
                      const f = i * 4;
                      var pos = new THREE.Vec3(position[p], position[p + 1], position[p + 2]);
                      var weights = skinWeight.slice(i * 4, i * 4 + 4);
                      var totalWeight = weights.reduce((a, b) => a + b);
                      var indices = skinIndex.slice(i * 4, i * 4 + 4);
                      var bones = indices.map((a, b) => allBones[a].matrix);
                      // "then over each bone that affects that vert"
                      var applied = bones.map((bone, i) =>
                          pos.clone().applyMatrix4(
                              // "weighted if you have bone weights"
                              bone.clone().multiplyScalar(weights[i] / totalWeight)
                          )
                      )
                      // "accumulate that"
                      var final = applied.reduce((a, b) => a.add(b), new THREE.Vec3(0, 0, 0))

                      final.multiplyScalar(1/4)
                      //bones.forEach((bone, i) => pos.applyMatrix4(bone.clone().multiplyScalar(weights[i])))
                      v.set(final.x, final.y, final.z)
                  })
                  /*
                  geometry.vertices.forEach(v => {
                      object.skeleton.bones.forEach(b => {
                          window.xx = [v, b]
                          v.applyMatrix4(b.matrixWorld.clone().multiplyScalar(1/object.skeleton.bones.length))
                      })
                  })
                  * /
              };

              object.geometry = geometry;

              triangles += geometry.faces.length;
              objects.push( {

                  geometry: geometry,
                  matrixWorld: object.matrixWorld,
                  boneMatrices: object.skeleton && object.skeleton.boneMatrices

              } );

          }
          */

        }

      });

    };

  }())

};
