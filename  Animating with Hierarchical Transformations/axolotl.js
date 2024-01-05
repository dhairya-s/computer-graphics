/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log("A3 Sept 2023");

var a = 7;
var b = 2.6;
console.log("a=", a, "b=", b);
var myvector = new THREE.Vector3(0, 1, 2);
console.log("myvector =", myvector);

var switchAnimation = false;
var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI / 180;

// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

// setup animation data structure, including a call-back function to use to update the model matrix
var myboxMotion = new Motion(myboxSetMatrices);
var handMotion = new Motion(handSetMatrices);
var axolotlMotion = new Motion(axolotlMatrices);
var axolotlMotion2 = new Motion(axolotlMatrices);

var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var sphere;
var mybox;
var meshes = {};

// SETUP RENDERER & SCENE

var canvas = document.getElementById("canvas");
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0xd0f0d0); // set background colour
canvas.appendChild(renderer.domElement);

const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
  // set up M_proj    (internally:  camera.projectionMatrix )
  var cameraFov = 30; // initial camera vertical field of view, in degrees
  // view angle, aspect ratio, near, far
  camera = new THREE.PerspectiveCamera(cameraFov, 1, 0.1, 1000);

  var width = 10;
  var height = 5;

  //    An example of setting up an orthographic projection using threejs:
  //    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

  // set up M_view:   (internally:  camera.matrixWorldInverse )
  camera.position.set(0, 12, 20);
  camera.up = new THREE.Vector3(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.add(listener);

  scene.add(camera);

  // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
  //    const controls = new OrbitControls( camera, renderer.domElement );
  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.autoRotate = false;
}

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
  window.scrollTo(0, 0);
};

////////////////////////////////////////////////////////////////////////
// init():  setup up scene
////////////////////////////////////////////////////////////////////////

function init() {
  console.log("init called");
  initCamera();

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sound.wav", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });

  initMotions();
  initLights();
  initObjects();
  initAxolotl();
  initHand();
  initFileObjects();

  window.addEventListener("resize", resize);
  resize();
}

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
  // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
  myboxMotion.addKeyFrame(new Keyframe("pose A", 0.0, [0, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe("pose B", 1.0, [0, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe("pose C", 2.0, [0, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe("pose D", 3.0, [0, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe("pose A", 4.0, [0, 0, 0, 0]));

  // basic interpolation test, just printing interpolation result to the console
  myboxMotion.currTime = 0.1;
  console.log("kf", myboxMotion.currTime, "=", myboxMotion.getAvars()); // interpolate for t=0.1
  myboxMotion.currTime = 2.9;
  console.log("kf", myboxMotion.currTime, "=", myboxMotion.getAvars()); // interpolate for t=2.9

  // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
  handMotion.addKeyFrame(new Keyframe("straight", 0.0, [0, 3, 0, 0, 0, 0, 0]));
  handMotion.addKeyFrame(
    new Keyframe("right finger curl", 1.0, [0, 3, 0, +90, -180, 0, 0])
  );

  // axolotl motion
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 0.0, [-2, 0, 0, 0, 0, 0, 0, 0, 90, 0, 0])
  );
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 2.0, [-1.5, 0, 0, 0, 20, 20, 20, 20, 100, 0, 0])
  );
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 4.0, [-1, 0, 0, 0, 0, 0, 0, 0, 90, 20, 20])
  );
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 6.0, [-0.5, 0, 0, 0, -30, -30, -30, -30, 80, 0, 0])
  );
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 8.0, [0, 0, 0, 0, 0, 0, 0, 0, 90, -30, -30])
  );
  axolotlMotion.addKeyFrame(
    new Keyframe("straight", 9.0, [-10, 2, 0, 0, 0, 0, 0, 0, 90, 0, 0])
  );

  axolotlMotion2.addKeyFrame(
    new Keyframe("straight", 0.0, [0, 0, 0, 0, 0, 0, 0, 0, 90, 0, 0])
  );
  axolotlMotion2.addKeyFrame(
    new Keyframe("straight", 2.0, [0, 0, 0, -10, 20, 20, 20, 20, 100, 0, 0])
  );
  axolotlMotion2.addKeyFrame(
    new Keyframe("straight", 4.0, [0, 0, 0, -20, 0, 0, 0, 0, 90, 20, 20])
  );
  axolotlMotion2.addKeyFrame(
    new Keyframe("straight", 6.0, [0, 0, 0, -10, -30, -30, -30, -30, 80, 0, 0])
  );
  axolotlMotion2.addKeyFrame(
    new Keyframe("straight", 8.0, [0, 0, 0, 0, 0, 0, 0, 0, 90, -30, -30])
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
  // note:  in the code below, we use the same keyframe information to animate both
  //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

  // update position of a box
  mybox.matrixAutoUpdate = false; // tell three.js not to over-write our updates
  mybox.matrix.identity();
  mybox.matrix.multiply(
    new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2])
  );
  mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
  mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0));
  mybox.updateMatrixWorld();

  // update position of a dragon
  // var theta = avars[3] * deg2rad;
  // meshes["dragon1"].matrixAutoUpdate = false;
  // meshes["dragon1"].matrix.identity();
  // meshes["dragon1"].matrix.multiply(
  //   new THREE.Matrix4().makeTranslation(avars[0], avars[1], 0)
  // );
  // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));
  // meshes["dragon1"].matrix.multiply(
  //   new THREE.Matrix4().makeScale(0.3, 0.3, 0.3)
  // );
  // meshes["dragon1"].updateMatrixWorld();
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2] * deg2rad;
  var theta2 = avars[3] * deg2rad;
  var theta3 = avars[4] * deg2rad;
  var theta4 = avars[5] * deg2rad;
  var theta5 = avars[6] * deg2rad;
  // console.log(avars);
  var M = new THREE.Matrix4();

  ////////////// link1
  linkFrame1.matrix.identity();
  linkFrame1.matrix.multiply(M.makeTranslation(xPosition, yPosition, 0));
  linkFrame1.matrix.multiply(M.makeRotationZ(theta1));
  //   Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  link1.matrix.copy(linkFrame1.matrix);
  link1.matrix.multiply(M.makeTranslation(2, 0, 0));
  link1.matrix.multiply(M.makeScale(5, 1, 3));

  ////////////// link2
  linkFrame2.matrix.copy(linkFrame1.matrix); // start with parent frame
  linkFrame2.matrix.multiply(M.makeTranslation(4.5, 0, 2));
  linkFrame2.matrix.multiply(M.makeRotationZ(theta2));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  link2.matrix.copy(linkFrame2.matrix);
  link2.matrix.multiply(M.makeTranslation(2, 0, 0));
  link2.matrix.multiply(M.makeScale(4, 1, 1));

  ///////////////  link3
  linkFrame3.matrix.copy(linkFrame2.matrix);
  linkFrame3.matrix.multiply(M.makeTranslation(4, 0, 0));
  linkFrame3.matrix.multiply(M.makeRotationZ(theta3));
  // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  link3.matrix.copy(linkFrame3.matrix);
  link3.matrix.multiply(M.makeTranslation(2, 0, 0));
  link3.matrix.multiply(M.makeScale(4, 1, 1));

  /////////////// link4
  linkFrame4.matrix.copy(linkFrame1.matrix);
  linkFrame4.matrix.multiply(M.makeTranslation(4.5, 0, -2));
  linkFrame4.matrix.multiply(M.makeRotationZ(theta4));
  // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  link4.matrix.copy(linkFrame4.matrix);
  link4.matrix.multiply(M.makeTranslation(2, 0, 0));
  link4.matrix.multiply(M.makeScale(4, 1, 1));

  // link5
  linkFrame5.matrix.copy(linkFrame4.matrix);
  linkFrame5.matrix.multiply(M.makeTranslation(4, 0, 0));
  linkFrame5.matrix.multiply(M.makeRotationZ(theta5));
  // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  link5.matrix.copy(linkFrame5.matrix);
  link5.matrix.multiply(M.makeTranslation(2, 0, 0));
  link5.matrix.multiply(M.makeScale(4, 1, 1));

  link1.updateMatrixWorld();
  link2.updateMatrixWorld();
  link3.updateMatrixWorld();
  link4.updateMatrixWorld();
  link5.updateMatrixWorld();

  linkFrame1.updateMatrixWorld();
  linkFrame2.updateMatrixWorld();
  linkFrame3.updateMatrixWorld();
  linkFrame4.updateMatrixWorld();
  linkFrame5.updateMatrixWorld();
}

/////////////////////////////////////
// initLights():  SETUP LIGHTS
/////////////////////////////////////

function initLights() {
  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 4, 2);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
}

/////////////////////////////////////
// MATERIALS
/////////////////////////////////////

var diffuseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var diffuseMaterial2 = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
var basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var armadilloMaterial = new THREE.MeshBasicMaterial({ color: 0x7fff7f });

/////////////////////////////////////
// initObjects():  setup objects in the scene
/////////////////////////////////////

function initObjects() {
  var worldFrame = new THREE.AxesHelper(5);
  scene.add(worldFrame);

  // mybox
  var myboxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth
  mybox = new THREE.Mesh(myboxGeometry, diffuseMaterial);
  mybox.position.set(4, 4, 0);
  // scene.add(mybox);

  // textured floor
  var floorTexture = new THREE.TextureLoader().load("images/water.jpg");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1);
  var floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
  });
  var floorGeometry = new THREE.PlaneGeometry(15, 15);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1.1;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  // sphere, located at light position
  var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32); // radius, segments, segments
  sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
  sphere.position.set(0, 4, 2);
  sphere.position.set(light.position.x, light.position.y, light.position.z);
  // scene.add(sphere);

  // box
  var boxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth
  var box = new THREE.Mesh(boxGeometry, diffuseMaterial);
  box.position.set(-4, 0, 0);
  // scene.add(box);

  // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html]
  var cubeMaterialArray = []; // order to add materials: x+,x-,y+,y-,z+,z-
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xff3333 }));
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xff8800 }));
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xffff33 }));
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x33ff33 }));
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x3333ff }));
  cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x8833ff }));
  // Cube parameters: width (x), height (y), depth (z),
  //        (optional) segments along x, segments along y, segments along z
  var mccGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1, 1, 1);
  var mcc = new THREE.Mesh(mccGeometry, cubeMaterialArray);
  mcc.position.set(0, 0, 0);
  //   scene.add(mcc);

  // cylinder
  // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
  var cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 20, 4);
  var cylinder = new THREE.Mesh(cylinderGeometry, diffuseMaterial);
  cylinder.position.set(2, 0, 0);
  // scene.add(cylinder);

  // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
  var coneGeometry = new THREE.CylinderGeometry(0.0, 0.3, 0.8, 20, 4);
  var cone = new THREE.Mesh(coneGeometry, diffuseMaterial);
  cone.position.set(4, 0, 0);
  //   scene.add(cone);

  // torus:   parameters -- radius, diameter, radialSegments, torusSegments
  var torusGeometry = new THREE.TorusGeometry(1.2, 0.4, 10, 20);
  var torus = new THREE.Mesh(torusGeometry, diffuseMaterial);

  torus.rotation.set(0, 0, 0); // rotation about x,y,z axes
  torus.scale.set(1, 2, 3);
  torus.position.set(-6, 0, 0); // translation

  // scene.add(torus);

  /////////////////////////////////////
  //  CUSTOM OBJECT
  ////////////////////////////////////

  var geom = new THREE.Geometry();
  var v0 = new THREE.Vector3(0, 0, 0);
  var v1 = new THREE.Vector3(3, 0, 0);
  var v2 = new THREE.Vector3(0, 3, 0);
  var v3 = new THREE.Vector3(3, 3, 0);

  geom.vertices.push(v0);
  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);

  geom.faces.push(new THREE.Face3(0, 1, 2));
  geom.faces.push(new THREE.Face3(1, 3, 2));
  geom.computeFaceNormals();

  customObject = new THREE.Mesh(geom, diffuseMaterial);
  customObject.position.set(0, 0, -2);
  // scene.add(customObject);
}

var bodyLink,
  headLink,
  eyeLink,
  eyeLink2,
  gillLink,
  gillLink2,
  gillLink3,
  gillLink4,
  leftArmLink,
  rightArmLink,
  leftArmLink2,
  rightArmLink2,
  leftFootLink,
  rightFootLink,
  leftFootLink2,
  rightFootLink2,
  tailLink;

var bodyLinkFrame,
  headLinkFrame,
  eyeLinkFrame,
  eyeLinkFrame2,
  gillLinkFrame,
  gillLinkFrame2,
  gillLinkFrame3,
  gillLinkFrame4,
  leftArmLinkFrame,
  rightArmLinkFrame,
  leftArmLink2Frame,
  rightArmLink2Frame,
  leftFootLinkFrame,
  rightFootLinkFrame,
  leftFootLink2Frame,
  rightFootLink2Frame,
  tailLinkFrame;

function initAxolotl() {
  var bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffc0cb });
  var eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
  var gillMaterial = new THREE.MeshLambertMaterial({ color: 0xfc4c4e });

  var boxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth
  var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  var headGeometry = new THREE.SphereGeometry(0.42, 32, 16);
  var tailGeometry = new THREE.ConeGeometry(0.25, 1, 32);
  var eyeGeometry = new THREE.SphereGeometry(0.05, 32, 16);
  var gillGeometry = new THREE.ConeGeometry(0.05, 0.25, 32);

  bodyLink = new THREE.Mesh(cylinderGeometry, bodyMaterial);
  scene.add(bodyLink);
  bodyLinkFrame = new THREE.AxesHelper(1);

  headLink = new THREE.Mesh(headGeometry, bodyMaterial);
  scene.add(headLink);
  headLinkFrame = new THREE.AxesHelper(1);

  eyeLink = new THREE.Mesh(eyeGeometry, eyeMaterial);
  scene.add(eyeLink);
  eyeLinkFrame = new THREE.AxesHelper(1);

  eyeLink2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
  scene.add(eyeLink2);
  eyeLinkFrame2 = new THREE.AxesHelper(1);

  gillLink = new THREE.Mesh(gillGeometry, gillMaterial);
  scene.add(gillLink);
  gillLinkFrame = new THREE.AxesHelper(1);

  gillLink2 = new THREE.Mesh(gillGeometry, gillMaterial);
  scene.add(gillLink2);
  gillLinkFrame2 = new THREE.AxesHelper(1);

  gillLink3 = new THREE.Mesh(gillGeometry, gillMaterial);
  scene.add(gillLink3);
  gillLinkFrame3 = new THREE.AxesHelper(1);

  gillLink4 = new THREE.Mesh(gillGeometry, gillMaterial);
  scene.add(gillLink4);
  gillLinkFrame4 = new THREE.AxesHelper(1);

  leftArmLink = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(leftArmLink);
  leftArmLinkFrame = new THREE.AxesHelper(1);

  rightArmLink = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(rightArmLink);
  rightArmLinkFrame = new THREE.AxesHelper(1);

  leftArmLink2 = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(leftArmLink2);
  leftArmLink2Frame = new THREE.AxesHelper(1);

  rightArmLink2 = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(rightArmLink2);
  rightArmLink2Frame = new THREE.AxesHelper(1);

  leftFootLink = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(leftFootLink);
  leftFootLinkFrame = new THREE.AxesHelper(1);

  rightFootLink = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(rightFootLink);
  rightFootLinkFrame = new THREE.AxesHelper(1);

  leftFootLink2 = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(leftFootLink2);
  leftFootLink2Frame = new THREE.AxesHelper(1);

  rightFootLink2 = new THREE.Mesh(boxGeometry, bodyMaterial);
  scene.add(rightFootLink2);
  rightFootLink2Frame = new THREE.AxesHelper(1);

  tailLink = new THREE.Mesh(tailGeometry, bodyMaterial);
  scene.add(tailLink);
  tailLinkFrame = new THREE.AxesHelper(1);

  bodyLink.matrixAutoUpdate = false;
  headLink.matrixAutoUpdate = false;
  eyeLink.matrixAutoUpdate = false;
  eyeLink2.matrixAutoUpdate = false;

  gillLink.matrixAutoUpdate = false;
  gillLink2.matrixAutoUpdate = false;
  gillLink3.matrixAutoUpdate = false;
  gillLink4.matrixAutoUpdate = false;

  leftArmLink.matrixAutoUpdate = false;
  rightArmLink.matrixAutoUpdate = false;
  leftArmLink2.matrixAutoUpdate = false;
  rightArmLink2.matrixAutoUpdate = false;
  leftFootLink.matrixAutoUpdate = false;
  rightFootLink.matrixAutoUpdate = false;
  leftFootLink2.matrixAutoUpdate = false;
  rightFootLink2.matrixAutoUpdate = false;
  tailLink.matrixAutoUpdate = false;

  bodyLinkFrame.matrixAutoUpdate = false;
  headLinkFrame.matrixAutoUpdate = false;
  eyeLinkFrame.matrixAutoUpdate = false;
  eyeLinkFrame2.matrixAutoUpdate = false;

  gillLinkFrame.matrixAutoUpdate = false;
  gillLinkFrame2.matrixAutoUpdate = false;
  gillLinkFrame3.matrixAutoUpdate = false;
  gillLinkFrame4.matrixAutoUpdate = false;

  leftArmLinkFrame.matrixAutoUpdate = false;
  rightArmLinkFrame.matrixAutoUpdate = false;
  leftArmLink2Frame.matrixAutoUpdate = false;
  rightArmLink2Frame.matrixAutoUpdate = false;
  leftFootLinkFrame.matrixAutoUpdate = false;
  rightFootLinkFrame.matrixAutoUpdate = false;
  leftFootLink2Frame.matrixAutoUpdate = false;
  rightFootLink2Frame.matrixAutoUpdate = false;
  tailLinkFrame.matrixAutoUpdate = false;
}

function axolotlMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[3] * deg2rad;
  var theta2 = avars[4] * deg2rad;
  var theta3 = avars[5] * deg2rad;
  var theta4 = avars[6] * deg2rad;
  var theta5 = avars[7] * deg2rad;
  var theta6 = avars[8] * deg2rad;
  var theta7 = avars[9] * deg2rad;
  var theta8 = avars[10] * deg2rad;

  // console.log(avars);
  var M = new THREE.Matrix4();

  bodyLinkFrame.matrix.identity();
  bodyLinkFrame.matrix.multiply(M.makeTranslation(xPosition, yPosition, 0));
  bodyLinkFrame.matrix.multiply(M.makeRotationY(theta1));

  bodyLink.matrix.copy(bodyLinkFrame.matrix);
  bodyLink.matrix.multiply(M.makeTranslation(2, 0, 0));
  bodyLink.matrix.multiply(M.makeRotationZ(90 * deg2rad));
  bodyLink.matrix.multiply(M.makeScale(2, 1, 2));

  // head
  headLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  headLinkFrame.matrix.multiply(M.makeTranslation(3, 0, 0));
  // headLinkFrame.matrix.multiply(M.makeRotationZ(theta1));

  headLink.matrix.copy(headLinkFrame.matrix);

  //eyes
  eyeLinkFrame.matrix.copy(headLinkFrame.matrix);
  eyeLinkFrame.matrix.multiply(M.makeTranslation(0.38, 0.1, 0.15));
  // eyeLinkFrame.matrix.multiply(M.makeRotationZ(theta1));

  eyeLinkFrame2.matrix.copy(headLinkFrame.matrix);
  eyeLinkFrame2.matrix.multiply(M.makeTranslation(0.38, 0.1, -0.15));
  // eyeLinkFrame2.matrix.multiply(M.makeRotationZ(theta1));

  eyeLink.matrix.copy(eyeLinkFrame.matrix);
  eyeLink2.matrix.copy(eyeLinkFrame2.matrix);

  //gills
  gillLinkFrame.matrix.copy(headLinkFrame.matrix);
  gillLinkFrame.matrix.multiply(M.makeTranslation(0.1, 0.2, 0.48));
  gillLinkFrame.matrix.multiply(M.makeRotationX(90 * deg2rad));

  gillLinkFrame2.matrix.copy(headLinkFrame.matrix);
  gillLinkFrame2.matrix.multiply(M.makeTranslation(0.1, 0.2, -0.48));
  gillLinkFrame2.matrix.multiply(M.makeRotationX(-90 * deg2rad));

  gillLinkFrame3.matrix.copy(headLinkFrame.matrix);
  gillLinkFrame3.matrix.multiply(M.makeTranslation(0.1, 0.35, 0.4));
  gillLinkFrame3.matrix.multiply(M.makeRotationX(40 * deg2rad));

  gillLinkFrame4.matrix.copy(headLinkFrame.matrix);
  gillLinkFrame4.matrix.multiply(M.makeTranslation(0.1, 0.35, -0.4));
  gillLinkFrame4.matrix.multiply(M.makeRotationX(-40 * deg2rad));

  gillLink.matrix.copy(gillLinkFrame.matrix);
  gillLink2.matrix.copy(gillLinkFrame2.matrix);
  gillLink3.matrix.copy(gillLinkFrame3.matrix);
  gillLink4.matrix.copy(gillLinkFrame4.matrix);

  // arms
  leftArmLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  leftArmLinkFrame.matrix.multiply(M.makeTranslation(2.8, -0.4, -0.35));
  leftArmLinkFrame.matrix.multiply(M.makeRotationX(-60 * deg2rad));
  leftArmLinkFrame.matrix.multiply(M.makeRotationY(theta2));

  leftArmLink.matrix.copy(leftArmLinkFrame.matrix);
  leftArmLink.matrix.multiply(M.makeScale(0.1, 0.1, 0.35));

  rightArmLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  rightArmLinkFrame.matrix.multiply(M.makeTranslation(2.8, -0.4, 0.35));
  rightArmLinkFrame.matrix.multiply(M.makeRotationX(60 * deg2rad));
  rightArmLinkFrame.matrix.multiply(M.makeRotationY(theta3));

  rightArmLink.matrix.copy(rightArmLinkFrame.matrix);
  rightArmLink.matrix.multiply(M.makeScale(0.1, 0.1, 0.35));

  leftArmLink2Frame.matrix.copy(leftArmLinkFrame.matrix);
  leftArmLink2Frame.matrix.multiply(M.makeTranslation(0, 0, -0.25));
  leftArmLink2Frame.matrix.multiply(M.makeRotationY(theta7));

  leftArmLink2.matrix.copy(leftArmLink2Frame.matrix);
  leftArmLink2.matrix.multiply(M.makeScale(0.15, 0.1, 0.35));

  rightArmLink2Frame.matrix.copy(rightArmLinkFrame.matrix);
  rightArmLink2Frame.matrix.multiply(M.makeTranslation(0, 0, 0.25));
  rightArmLink2Frame.matrix.multiply(M.makeRotationY(theta8));

  rightArmLink2.matrix.copy(rightArmLink2Frame.matrix);
  rightArmLink2.matrix.multiply(M.makeScale(0.15, 0.1, 0.35));

  // legs
  leftFootLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  leftFootLinkFrame.matrix.multiply(M.makeTranslation(1.25, -0.4, -0.35));
  leftFootLinkFrame.matrix.multiply(M.makeRotationX(-60 * deg2rad));
  leftFootLinkFrame.matrix.multiply(M.makeRotationY(theta4));

  leftFootLink.matrix.copy(leftFootLinkFrame.matrix);
  leftFootLink.matrix.multiply(M.makeScale(0.1, 0.1, 0.35));

  rightFootLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  rightFootLinkFrame.matrix.multiply(M.makeTranslation(1.25, -0.4, 0.35));
  rightFootLinkFrame.matrix.multiply(M.makeRotationX(60 * deg2rad));
  rightFootLinkFrame.matrix.multiply(M.makeRotationY(theta5));

  rightFootLink.matrix.copy(rightFootLinkFrame.matrix);
  rightFootLink.matrix.multiply(M.makeScale(0.1, 0.1, 0.35));

  leftFootLink2Frame.matrix.copy(leftFootLinkFrame.matrix);
  leftFootLink2Frame.matrix.multiply(M.makeTranslation(0, 0, -0.25));
  leftFootLink2Frame.matrix.multiply(M.makeRotationY(theta7));

  leftFootLink2.matrix.copy(leftFootLink2Frame.matrix);
  leftFootLink2.matrix.multiply(M.makeScale(0.15, 0.1, 0.35));

  rightFootLink2Frame.matrix.copy(rightFootLinkFrame.matrix);
  rightFootLink2Frame.matrix.multiply(M.makeTranslation(0, 0, 0.25));
  rightFootLink2Frame.matrix.multiply(M.makeRotationY(theta8));

  rightFootLink2.matrix.copy(rightFootLink2Frame.matrix);
  rightFootLink2.matrix.multiply(M.makeScale(0.15, 0.1, 0.35));

  //tail
  tailLinkFrame.matrix.copy(bodyLinkFrame.matrix);
  tailLinkFrame.matrix.multiply(M.makeTranslation(0.5, 0, 0));
  tailLinkFrame.matrix.multiply(M.makeRotationZ(theta6));

  tailLink.matrix.copy(tailLinkFrame.matrix);

  bodyLink.updateMatrixWorld();
  headLink.updateMatrixWorld();
  eyeLink.updateMatrixWorld();
  eyeLink2.updateMatrixWorld();
  leftArmLink.updateMatrixWorld();
  rightArmLink.updateMatrixWorld();
  leftArmLink2.updateMatrixWorld();
  rightArmLink2.updateMatrixWorld();
  leftFootLink.updateMatrixWorld();
  rightFootLink.updateMatrixWorld();
  leftFootLink2.updateMatrixWorld();
  rightFootLink2.updateMatrixWorld();
  tailLink.updateMatrixWorld();

  bodyLinkFrame.updateMatrixWorld();
  headLinkFrame.updateMatrixWorld();
  eyeLinkFrame.updateMatrixWorld();
  eyeLinkFrame2.updateMatrixWorld();
  leftArmLinkFrame.updateMatrixWorld();
  rightArmLinkFrame.updateMatrixWorld();
  leftArmLink2Frame.updateMatrixWorld();
  rightArmLink2Frame.updateMatrixWorld();
  leftFootLinkFrame.updateMatrixWorld();
  rightFootLinkFrame.updateMatrixWorld();
  leftFootLink2Frame.updateMatrixWorld();
  rightFootLink2Frame.updateMatrixWorld();
  tailLinkFrame.updateMatrixWorld();
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
  var handMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var boxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth

  link1 = new THREE.Mesh(boxGeometry, handMaterial);
  //   scene.add(link1);
  linkFrame1 = new THREE.AxesHelper(1);
  // scene.add(linkFrame1);
  link2 = new THREE.Mesh(boxGeometry, handMaterial);
  // scene.add(link2);
  linkFrame2 = new THREE.AxesHelper(1);
  // scene.add(linkFrame2);
  link3 = new THREE.Mesh(boxGeometry, handMaterial);
  // scene.add(link3);
  linkFrame3 = new THREE.AxesHelper(1);
  // scene.add(linkFrame3);
  link4 = new THREE.Mesh(boxGeometry, handMaterial);
  // scene.add(link4);
  linkFrame4 = new THREE.AxesHelper(1);
  // scene.add(linkFrame4);
  link5 = new THREE.Mesh(boxGeometry, handMaterial);
  // scene.add(link5);
  linkFrame5 = new THREE.AxesHelper(1);
  // scene.add(linkFrame5);

  link1.matrixAutoUpdate = false;
  link2.matrixAutoUpdate = false;
  link3.matrixAutoUpdate = false;
  link4.matrixAutoUpdate = false;
  link5.matrixAutoUpdate = false;
  linkFrame1.matrixAutoUpdate = false;
  linkFrame2.matrixAutoUpdate = false;
  linkFrame3.matrixAutoUpdate = false;
  linkFrame4.matrixAutoUpdate = false;
  linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial({
  //        uniforms: { textureSampler: {type: 't', value: floorTexture}},
  vertexShader: document.getElementById("customVertexShader").textContent,
  fragmentShader: document.getElementById("customFragmentShader").textContent,
});

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////

var models;

function initFileObjects() {
  // list of OBJ files that we want to load, and their material
  models = {
    teapot: { obj: "obj/teapot.obj", mtl: customShaderMaterial, mesh: null },
    armadillo: {
      obj: "obj/armadillo.obj",
      mtl: customShaderMaterial,
      mesh: null,
    },
    dragon: { obj: "obj/dragon.obj", mtl: customShaderMaterial, mesh: null },
  };

  var manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    console.log("loaded all resources");
    RESOURCES_LOADED = true;
    onResourcesLoaded();
  };
  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };
  var onError = function (xhr) {};

  // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
  for (var _key in models) {
    console.log("Key:", _key);
    (function (key) {
      var objLoader = new THREE.OBJLoader(manager);
      objLoader.load(
        models[key].obj,
        function (object) {
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material = models[key].mtl;
              child.material.shading = THREE.SmoothShading;
            }
          });
          models[key].mesh = object;
        },
        onProgress,
        onError
      );
    })(_key);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded() {
  // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
  //                             i.e., creates references to the geometry, and not full copies ]
  meshes["armadillo1"] = models.armadillo.mesh.clone();
  meshes["armadillo2"] = models.armadillo.mesh.clone();
  meshes["dragon1"] = models.dragon.mesh.clone();
  meshes["teapot1"] = models.teapot.mesh.clone();
  meshes["teapot2"] = models.teapot.mesh.clone();

  // position the object instances and parent them to the scene, i.e., WCS
  // For static objects in your scene, it is ok to use the default postion / rotation / scale
  // to build the object-to-world transformation matrix. This is what we do below.
  //
  // Three.js builds the transformation matrix according to:  M = T*R*S,
  // where T = translation, according to position.set()
  //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
  //            R = Rx * Ry * Rz
  //       S = scale, according to scale.set()

  meshes["armadillo1"].position.set(3, 1.5, 2);
  meshes["armadillo1"].rotation.set(0, Math.PI / 2, 0);
  meshes["armadillo1"].scale.set(1, 1, 1);
  // scene.add(meshes["armadillo1"]);

  meshes["armadillo2"].position.set(-3, 1.5, 2);
  meshes["armadillo2"].rotation.set(0, -Math.PI / 2, 0);
  meshes["armadillo2"].scale.set(1, 1, 1);
  //   // scene.add(meshes["armadillo2"]);

  // note:  the local transformations described by the following position, rotation, and scale
  // are overwritten by the animation loop for this particular object, which directly builds the
  // dragon1-to-world transformation matrix
  meshes["dragon1"].position.set(4.5, 0, 0);
  meshes["dragon1"].rotation.set(0, 0, 0);
  meshes["dragon1"].scale.set(0.2, 0.2, 0.2);
  scene.add(meshes["dragon1"]);

  meshes["teapot1"].position.set(3, 0, 3);
  meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
  // // scene.add(meshes["teapot1"]);

  meshes["teapot2"].position.set(3, 0, 6);
  meshes["teapot2"].scale.set(0.5, 0.8, 0.5);
  // // scene.add(meshes["teapot2"]);

  meshesLoaded = true;
}

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  // up
  if (keyCode == "W".charCodeAt()) {
    // W = up
    light.position.y += 0.11;
    // down
  } else if (keyCode == "S".charCodeAt()) {
    // S = down
    light.position.y -= 0.11;
    // left
  } else if (keyCode == "A".charCodeAt()) {
    // A = left
    light.position.x -= 0.1;
    // right
  } else if (keyCode == "D".charCodeAt()) {
    // D = right
    light.position.x += 0.11;
  } else if (keyCode == " ".charCodeAt()) {
    // space
    animation = !animation;
  } else if (keyCode == "C".charCodeAt()) {
    switchAnimation = !switchAnimation;
  }
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  var dt = 0.02;
  if (animation && meshesLoaded) {
    // advance the motion of all the animated objects
    myboxMotion.timestep(dt); // note: will also call myboxSetMatrices(), provided as a callback fn during setup
    handMotion.timestep(dt);
    if (!switchAnimation) {
      axolotlMotion.timestep(dt);
    } else {
      axolotlMotion2.timestep(dt);
    }
  }
  if (meshesLoaded) {
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(update); // requests the next update call;  this creates a loop
}

init();
update();
