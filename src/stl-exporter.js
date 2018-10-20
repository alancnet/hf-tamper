const THREE = require('./three')

THREE.STLExporter = function() {};

THREE.STLExporter.prototype = {

  constructor: THREE.STLExporter,

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

          var geometry = object.geometry;

          if (geometry.isBufferGeometry) {

            geometry = new THREE.Geometry().fromBufferGeometry(geometry);

          }

          if (geometry.isGeometry) {

            triangles += geometry.faces.length;
            objects.push({

              geometry: geometry,
              matrixWorld: object.matrixWorld,
              boneMatrices: object.skeleton && object.skeleton.boneMatrices

            });

          }

        }

      });

      if (true) {
        var output = '';

        output += 'solid exported\n';

        for (var i = 0, il = objects.length; i < il; i++) {

          var object = objects[i];

          var vertices = object.geometry.vertices;
          var faces = object.geometry.faces;
          var matrixWorld = object.matrixWorld;
          var boneMatrices = object.boneMatrices;

          normalMatrixWorld.getNormalMatrix(matrixWorld);

          for (var j = 0, jl = faces.length; j < jl; j++) {

            var face = faces[j];

            vector.copy(face.normal) // .applyMatrix3( normalMatrixWorld ).normalize();

            output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
            output += '\t\touter loop\n';

            var indices = [face.a, face.b, face.c];

            for (var k = 0; k < 3; k++) {

              vector.copy(vertices[indices[k]]).applyMatrix4(matrixWorld);

              output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';

            }

            output += '\t\tendloop\n';
            output += '\tendfacet\n';

          }

        }

        output += 'endsolid exported\n';

        return output;

      }

    };

  }())

};

