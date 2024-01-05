/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 ------------ Sept 2023, Assignment 1
/////////////////////////////////////////////////////////////////////////////////////////

// console.log('Welcome!');
console.log("SEPTEMBER 2023 A1 by Dhairya");
console.log("Dividing 5 by 0", 5 / 0);
console.log("What is this variable", canvas);

var foo;
console.log("Var foo is", foo);

a = 10;
b = 3;
function go() {
  var a = 14; //local variable
  b = 15;
}
go();
console.log("a=", a, "b=", b);

a = 8;
b = 2.6;
console.log("a=", a, "b=", b);
myvector = new THREE.Vector3(0, 1, 2);
console.log("myvector =", myvector);

// SETUP RENDERER & SCENE
var canvas = document.getElementById("canvas");
var scene = new THREE.Scene();
// var renderer = new THREE.WebGLRenderer( { antialias: true } );
var renderer = new THREE.WebGLRenderer({ antialias: false });
// renderer.setPixelRatio(1.0);

// set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255]
renderer.setClearColor(0xadd8e6);
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.01, 1e99); // view angle, aspect ratio, near, far
camera.position.set(0, 12, 20);
camera.lookAt(0, 0, 0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  //  renderer.setSize(window.innerWidth/4,window.innerHeight/4, false);
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log("window size: ", window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener("resize", resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
  window.scrollTo(0, 0);
};

/////////////////////////////////////
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////

light = new THREE.PointLight(0xffffff);
light.position.set(0, 4, 3);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var diffuseMaterial2 = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

//
//  DEFINE OBJECTS
//

/////////////////////////////////////
// WORLD COORDINATE FRAME
/////////////////////////////////////

var worldFrame = new THREE.AxesHelper(5);
scene.add(worldFrame);

///////////////////////////////////////////////////////////////////////
//   box
///////////////////////////////////////////////////////////////////////

boxGeometry = new THREE.BoxGeometry(2, 2, 2); // width, height, depth
boxMaterial = new THREE.MeshLambertMaterial({ color: 0x7070ff });
box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-4, 1, 2);
scene.add(box);

/////////////////////////////////////////////////////////////////////////
// cylinder
/////////////////////////////////////////////////////////////////////////

// parameters:
//    radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 20, 5);
cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f030 });
cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(2, 1, 2);
scene.add(cylinder);

/////////////////////////////////////////////////////////////////////////
// cone
/////////////////////////////////////////////////////////////////////////

// parameters:
//    radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
coneGeometry = new THREE.CylinderGeometry(0.0, 0.5, 3.0, 20, 4);
coneMaterial = new THREE.MeshLambertMaterial({ color: 0x40f030 });
cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(4, 1.5, 2);
scene.add(cone);

/////////////////////////////////////////////////////////////////////////
// torus
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry = new THREE.TorusGeometry(1.2, 0.4, 10, 20);
torusMaterial = new THREE.MeshLambertMaterial({ color: 0x40f0f0 });
torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(6, 3.2, 0);
torus.rotation.set(Math.PI / 2, 0, 0); // rotation about x,y,z axes
scene.add(torus);

/////////////////////////////////////////////////////////////////////////
// (i) second torus, parallel to the ground
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry2 = new THREE.TorusGeometry(1.2, 0.4, 10, 20);
torusMaterial2 = new THREE.MeshLambertMaterial({ color: 0x40f0f0 });
torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
torus2.position.set(8, 3.2, 0);
torus2.rotation.set(Math.PI, 0, 0); // rotation about x,y,z axes
scene.add(torus2);

///////////////////////////////////////////////////////////////////////
//   (j) twisting stack of three cubes
///////////////////////////////////////////////////////////////////////

cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // width, height, depth
cubeMaterialBlue = new THREE.MeshLambertMaterial({ color: 0x0000ff });
cubeMaterialYellow = new THREE.MeshLambertMaterial({ color: 0xffff00 });
cubeMaterialRed = new THREE.MeshLambertMaterial({ color: 0xff0000 });

cube1 = new THREE.Mesh(cubeGeometry, cubeMaterialBlue);
cube2 = new THREE.Mesh(cubeGeometry, cubeMaterialYellow);
cube3 = new THREE.Mesh(cubeGeometry, cubeMaterialRed);

cube1.position.set(-4, 1, -3);
cube1.rotation.set(0, Math.PI / 3, 0);
cube2.position.set(-4, 3, -3);
cube2.rotation.set(0, Math.PI / 6, 0);
cube3.position.set(-4, 5, -3);
cube3.rotation.set(0, Math.PI / 9, 0);

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

/////////////////////////////////////
// FLOOR with texture
/////////////////////////////////////

floorTexture = new THREE.TextureLoader().load("images/floor.jpg");
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 1);
floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
floorGeometry = new THREE.PlaneBufferGeometry(15, 15); // x,y size
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

///////////////////////////////////////////////////////////////////////
//   sphere, representing the light source
///////////////////////////////////////////////////////////////////////

lightObjGeometry = new THREE.SphereGeometry(0.3, 32, 32); // radius, segments, segments
lightObjMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
lightObj.position.set(0, 4, 2);
lightObj.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightObj);

/////////////////////////////////////
//  CUSTOM SQUARE: mySquare
////////////////////////////////////

// mySquareGeom = new THREE.Geometry();
// mySquareMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });

// var v0 = new THREE.Vector3(0, 0, 0);
// var v1 = new THREE.Vector3(3, 0, 0);
// var v2 = new THREE.Vector3(0, 3, 0);
// var v3 = new THREE.Vector3(3, 3, 0);

// mySquareGeom.vertices.push(v0);
// mySquareGeom.vertices.push(v1);
// mySquareGeom.vertices.push(v2);
// mySquareGeom.vertices.push(v3);

// mySquareGeom.faces.push(new THREE.Face3(0, 1, 2));
// // mySquareGeom.faces.push(new THREE.Face3(0, 1, 2));
// mySquareGeom.faces.push(new THREE.Face3(1, 3, 2));
// mySquareGeom.computeFaceNormals();

// cs = new THREE.Mesh(mySquareGeom, mySquareMaterial);
// cs.position.set(3, 0, -3);
// scene.add(cs);

/////////////////////////////////////
//  (k) CUSTOM OBJ: C
////////////////////////////////////

mySquareGeom = new THREE.Geometry();
mySquareMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });

var v0 = new THREE.Vector3(0, 0, 0);
var v1 = new THREE.Vector3(1, 1, 0); // left bottom
var v2 = new THREE.Vector3(1, 2, 0); // left top
var v3 = new THREE.Vector3(2, 0, 0); // bottom left
var v4 = new THREE.Vector3(2, 3, 0); // top left
var v5 = new THREE.Vector3(3, 0, 0); // bottom right
var v6 = new THREE.Vector3(3, 3, 0); // top right

mySquareGeom.vertices.push(v0);
mySquareGeom.vertices.push(v1);
mySquareGeom.vertices.push(v2);
mySquareGeom.vertices.push(v3);
mySquareGeom.vertices.push(v4);
mySquareGeom.vertices.push(v5);
mySquareGeom.vertices.push(v6);

mySquareGeom.faces.push(new THREE.Face3(1, 3, 5));
mySquareGeom.faces.push(new THREE.Face3(2, 6, 4));
mySquareGeom.faces.push(new THREE.Face3(2, 1, 4));
mySquareGeom.faces.push(new THREE.Face3(1, 3, 2));

mySquareGeom.computeFaceNormals();

cs = new THREE.Mesh(mySquareGeom, mySquareMaterial);
cs.position.set(3, 0, -3);
scene.add(cs);

/////////////////////////////////////////////////////////////////////////////////////
//  create a teapot material that uses the vertex & fragment shaders, as defined in a1.html
/////////////////////////////////////////////////////////////////////////////////////

var teapotMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("teapotVertexShader").textContent,
  fragmentShader: document.getElementById("teapotFragmentShader").textContent,
});

var ctx = renderer.context;
ctx.getShaderInfoLog = function () {
  return "";
}; // stops shader warnings, seen in some browsers

/////////////////////////////////////////////////////////////////////////////////////
//  Teapot Object loaded from OBJ file, rendered using teapotMaterial
/////////////////////////////////////////////////////////////////////////////////////

var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

var onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
};
var onError = function (xhr) {};
var loader = new THREE.OBJLoader(manager);
loader.load(
  "obj/teapot.obj",
  function (object) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = teapotMaterial;
      }
    });
    scene.add(object);
  },
  onProgress,
  onError
);

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) {
    console.log("W pressed");
    if (light.position.y >= 5.0) {
      light.position.y = 5.0;
    } else {
      light.position.y += 0.1;
    }
  } else if (keyboard.pressed("S")) {
    if (light.position.y <= -5.0) {
      light.position.y = -5.0;
    } else {
      light.position.y -= 0.1;
    }
  }
  if (keyboard.pressed("A")) {
    if (light.position.x <= -5.0) {
      light.position.x = -5.0;
    } else {
      light.position.x -= 0.1;
    }
  } else if (keyboard.pressed("D")) {
    if (light.position.x >= 5.0) {
      light.position.x = 5.0;
    } else {
      light.position.x += 0.1;
    }
  }
  lightObj.position.set(light.position.x, light.position.y, light.position.z);
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  checkKeyboard();
  requestAnimationFrame(update); // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();
