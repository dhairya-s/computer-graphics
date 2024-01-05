/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 ------------ Sept 2023, Assignment 1
/////////////////////////////////////////////////////////////////////////////////////////

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
camera.position.set(0, 5, 30);
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

/////////////////////////////////////
// FLOOR with texture
/////////////////////////////////////

floorTexture = new THREE.TextureLoader().load(
  "images/Flag_of_British_Columbia.png"
);
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

/////////////////////////////////////////////////////////////////////////////////////
//  create a teapot material that uses the vertex & fragment shaders, as defined in a1.html
/////////////////////////////////////////////////////////////////////////////////////

var mountainMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("mountainVertexShader").textContent,
  fragmentShader: document.getElementById("mountainFragmentShader").textContent,
});

var ctx = renderer.context;
ctx.getShaderInfoLog = function () {
  return "";
}; // stops shader warnings, seen in some browsers

/////////////////////////////////////
// Winter Olymics Rings
////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry = new THREE.TorusGeometry(1.2, 0.1, 100, 100);
torus = new THREE.Mesh(torusGeometry, mountainMaterial);
torus.position.set(2.8, 4.5, 0);
torus.rotation.set(0, 0, 0); // rotation about x,y,z axes
scene.add(torus);

torusGeometry2 = new THREE.TorusGeometry(1.2, 0.1, 100, 100);
torus2 = new THREE.Mesh(torusGeometry2, mountainMaterial);
torus2.position.set(0, 4.5, 0);
torus2.rotation.set(0, 0, 0); // rotation about x,y,z axes
scene.add(torus2);

torusGeometry3 = new THREE.TorusGeometry(1.2, 0.1, 100, 100);

torus3 = new THREE.Mesh(torusGeometry3, mountainMaterial);
torus3.position.set(-2.8, 4.5, 0);
torus3.rotation.set(0, 0, 0); // rotation about x,y,z axes
scene.add(torus3);

torusGeometry4 = new THREE.TorusGeometry(1.2, 0.1, 100, 100);

torus4 = new THREE.Mesh(torusGeometry4, mountainMaterial);
torus4.position.set(1.4, 3.1, 0);
torus4.rotation.set(0, 0, 0); // rotation about x,y,z axes
scene.add(torus4);

torusGeometry5 = new THREE.TorusGeometry(1.2, 0.1, 100, 100);

torus5 = new THREE.Mesh(torusGeometry5, mountainMaterial);
torus5.position.set(-1.4, 3.1, 0);
torus5.rotation.set(0, 0, 0); // rotation about x,y,z axes
scene.add(torus5);

/////////////////////////////////////
// Mountain and Peak
////////////////////////////////////

myMountainGeom = new THREE.Geometry();
myMountainMaterial = new THREE.MeshBasicMaterial({ color: 0x977c53 });

var v0 = new THREE.Vector3(0, 0, 0);
var v1 = new THREE.Vector3(7.5, 9, 0);
var v2 = new THREE.Vector3(15, 0, 0);

myMountainGeom.vertices.push(v0);
myMountainGeom.vertices.push(v1);
myMountainGeom.vertices.push(v2);

myMountainGeom.faces.push(new THREE.Face3(0, 2, 1));

myMountainGeom.computeFaceNormals();

cs = new THREE.Mesh(myMountainGeom, myMountainMaterial);
cs.position.set(-7.5, 0, -7.5);
scene.add(cs);

myPeakGeom = new THREE.Geometry();
myPeakMaterial = new THREE.MeshBasicMaterial({ color: 0xf8f6ec });

var v0 = new THREE.Vector3(4.2, 5, 0);
var v1 = new THREE.Vector3(7.5, 9, 0);
var v2 = new THREE.Vector3(10.8, 5, 0);

myPeakGeom.vertices.push(v0);
myPeakGeom.vertices.push(v1);
myPeakGeom.vertices.push(v2);

myPeakGeom.faces.push(new THREE.Face3(0, 2, 1));

myPeakGeom.computeFaceNormals();

cs = new THREE.Mesh(myPeakGeom, myPeakMaterial);
cs.position.set(-7.5, 0, -7.4);
scene.add(cs);

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
