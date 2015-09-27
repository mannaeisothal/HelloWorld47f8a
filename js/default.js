var camera, renderer, scene;
var meshArray = [];

window.onload = function () {
  LEIA.physicalScreen.InitFromExternalJson('https://s3.amazonaws.com/leiacore/config.json',function(){
    Init();
    animate();
  });
};

function Init() {
  LEIA.virtualScreen.Init();
  
  //LEIA.virtualScreen.loadDefault();
 /* LEIA.virtualScreen.width = 40;
  LEIA.virtualScreen.center.copy({x:0.00,y:0.00,z:0.00});
  LEIA.virtualScreen.normal.copy({x:0.00,y:0.00,z:1.00});
  LEIA.virtualScreen.b = 1.0;
  LEIA.virtualScreen.d = 500;
  LEIA.virtualScreen.disp = 5;*/
 // LEIA.virtualScreen.h = 1/10.0; //1/10.0;
  //LEIA.physicalScreen.resolution = new THREE.Vector2(200,150);
  scene = new THREE.Scene();

  //setup camera
  camera = new LeiaCamera({
    dCtoZDP: LEIA.virtualScreen.d,
    zdpNormal: LEIA.virtualScreen.normal,
    targetPosition: LEIA.virtualScreen.center
  });
  scene.add(camera);

  //setup rendering parameter
  renderer = new LeiaWebGLRenderer({
    antialias: true,
    devicePixelRatio: 1,
    renderMode: _renderMode,
    colorMode: _colorMode,
    superSampleSharpen:false,
    messageFlag: _targetEnvironment
  });
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.BasicShadowMap;
  Leia_addRender(renderer, {
    bFPSVisible: true
  });

  //add object to Scene
  addObjectsToScene();

  //add Light
  addLights();

  //add Gyro Monitor
  //addGyroMonitor();
}

function animate() {
  requestAnimationFrame(animate);

  //set mesh animation
  for (var i = 0; i < meshArray.length; i++) {
    var curMeshGroup = meshArray[i].meshGroup;
    switch (meshArray[i].name) {
    case "helloworld":
      curMeshGroup.rotation.x = 0.8 * Math.sin(5.0 * LEIA.time);
      curMeshGroup.rotation.z = 0.6 * 0.6 * Math.sin(3.0 * LEIA.time);
      break;
    case "LEIA1":
      curMeshGroup.rotation.x = 0.8 * Math.sin(5.0 * LEIA.time);
      curMeshGroup.rotation.y = 0.6 * 0.6 * Math.sin(3.0 * LEIA.time);
      break;
    default:
      break;
    }
  }
  renderer.Leia_render({
    scene: scene,
    camera: camera
  });
}

function addObjectsToScene() {
  //Add your objects here
  //API to add STL Object
  Leia_LoadSTLModel({
//    path: 'resource/LEIA1.stl'
    path: 'resource/chess.STL'
  }, function (mesh) {
    // mesh.material.side = THREE.DoubleSide;
    mesh.castShadow = true;
    //  mesh.material.metal = true;
    mesh.scale.set(60, 60, 60);
    mesh.position.set(0, 0, 10);
    var group = new THREE.Object3D();
    group.add(mesh);
    scene.add(group);
    meshArray.push({
      meshGroup: group,
      name: 'LEIA1'
    });
  });

  //add background texture
  var backgroundPlane = Leia_createTexturePlane({
    filename: 'resource/world-map-background2.jpg',
    width: 100,
    height: 75
  });
  backgroundPlane.position.z = -8;
  backgroundPlane.castShadow = false;
  backgroundPlane.receiveShadow = true;
  scene.add(backgroundPlane);

  //add center plane
  var centerPlane = Leia_createTexturePlane({
    filename: 'resource/crack001.png',
    width: 100,
    height: 75,
    transparent: true

  });
  centerPlane.position.z = 0;
  scene.add(centerPlane);
}

function createText(parameters) {
  parameters = parameters || {};
  var strText = parameters.text;
  var size = parameters.size;
  var menuGeometry = new THREE.TextGeometry(
    strText, {
      size: size,
      height: 2,
      curveSegments: 4,
      font: "helvetiker",
      weight: "normal",
      style: "normal",
      bevelThickness: 0.6,
      bevelSize: 0.25,
      bevelEnabled: true,
      material: 0,
      extrudeMaterial: 1
    }
  );
  var menuMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
      }), // front
            new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.SmoothShading
      }) // side
        ]
  );
  var menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
  return menuMesh;
}

function addLights() {
  //Add Lights Here
/*  var light = new THREE.SpotLight(0xffffff);
  light.position.set(0, 60, 60);
  light.shadowCameraVisible = false;
  light.castShadow = true;
  light.shadowMapWidth = light.shadowMapHeight = 256;
  light.shadowDarkness = 0.7;
  scene.add(light);*/
  var xl = new THREE.DirectionalLight( 0xffffff );
  xl.position.set( 1, 0, 2 );
  scene.add( xl );
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
}
