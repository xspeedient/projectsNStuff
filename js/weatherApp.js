"use strict"
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 20000 );
var light = new THREE.AmbientLight( 0xffffff, .68 );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);
// var renderer = new THREE.WebGLRenderer();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

////////////
// skybox //
////////////
//!! Need to add if statement to change skybox to reflect weather

var materialArray = [];
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/stormCloud.jpg' ) }));
for (var i = 0; i < 6; i++)
   materialArray[i].side = THREE.BackSide;
var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyboxGeom = new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1 );
var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
scene.add( skybox );
skybox.position.y = 120;

//create box for crate texture
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0x800020 } );
// var material2 = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x800020, specular: 0x555555, shininess: 15 } );
var material2 = new THREE.MeshPhongMaterial( {color: 0x800020, transparent: true, opacity: 0.4} )
var texture = THREE.ImageUtils.loadTexture('images/crate.jpg');
//var material = new THREE.MeshBasicMaterial({map: texture});
var material = new THREE.MeshPhongMaterial({map: texture});

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 3;

var cube2 = new THREE.Mesh( geometry, material2 );
scene.add(cube2);

function createFloor() {
  geometry = new THREE.PlaneGeometry(2000, 2000, 5, 5);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
  var texture = THREE.ImageUtils.loadTexture('images/Grass.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(64, 64);
  material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
  return new THREE.Mesh(geometry, material);
}

var mesh = createFloor();
scene.add(mesh);

cube.position.y = 20;
cube.position.z = 0;

cube2.position.y = 21;
cube2.position.z = 0;
cube2.position.x = 3;

camera.position.y = 20;
// camera.position.z = 100;

//make gold point light and helper
/*  var goldPoint = new THREE.PointLight(0xDAA520, 2, 150);
goldPoint.position.set( -26, 43, -35 );
scene.add(goldPoint);
scene.add(new THREE.PointLightHelper(goldPoint, 3)); */



//lensflare
function addLight(scene, h, s, l, x, y, z ) {
  // THREE.ImageUtils.crossOrigin = '';
  var textureFlare0 = THREE.ImageUtils.loadTexture('images/flare.png');

  var fLight = new THREE.PointLight( 0xDAA520, 1.8, 150 );
//  fLight.color.setHSL( h, s, l );
  fLight.position.set( x, y, z );
  scene.add( fLight );
  // fLight = fLight;

  var flareColor = new THREE.Color( 0xffffff );
  flareColor.setHSL( h, s, l + 0.5 );

  var lensFlare = new THREE.LensFlare( textureFlare0, 200, 0.0, THREE.AdditiveBlending, flareColor );

  lensFlare.position.copy( fLight.position );
  // var lensFlare = lensFlare;

  scene.add( lensFlare );
  //scene.add(new THREE.PointLightHelper(fLight, 3));

}

addLight(scene,0.55, 0.9, 0.5,-32, 42, -35);


// make snow
var snowGeometry = new THREE.Geometry();
for ( i = 0; i < 5000; i ++ ) {
  var vertex = new THREE.Vector3();
  vertex.x = 1500 * Math.random() - 500;
  vertex.y = 1500 * Math.random() - 500;
  vertex.z = 1500 * Math.random() - 500;
  snowGeometry.vertices.push( vertex );
}
material = new THREE.ParticleBasicMaterial( { size: 2.5, sizeAttenuation: true, transparent: true, opacity: 0.5 } );
material.color.setHex( 0xFFFFFF );
particles = new THREE.ParticleSystem( snowGeometry, material );
particles.sortParticles = true;
scene.add( particles );
particles.position.z = -680;
particles.position.y = 50;

// render loop
function render() {
  requestAnimationFrame( render );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;

  particles.rotation.x = Date.now() * 0.0002;

  renderer.render( scene, camera );
}
render();
