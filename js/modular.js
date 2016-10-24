var skyboxImg = '../images/pixCloud.jpg';
var light;
var fLight;
var particles;
var lensFlare;

//setting up scene, camera, ambient light
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 20000 );
camera.position.z = 3;
ambient();

// var renderer = new THREE.WebGLRenderer();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//create box geometry for crate texture
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var texture = THREE.ImageUtils.loadTexture('../images/crate.jpg');
var material = new THREE.MeshPhongMaterial({map: texture});

//apply geometry and material to cube object
var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// ambient light
function ambient() {
  light = new THREE.AmbientLight( 0xffffff, .68 );
  light.position.set( 0, 1, 1 ).normalize();
  scene.add(light);
}

//render cube animation
function cubeRender() {
  requestAnimationFrame( cubeRender );
  cube.rotation.x += -0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.002;
};
cubeRender();

//make floor
function createFloor(floorTexture) {
  floorTexture = floorTexture || '../images/Grass.jpg';
  geometry = new THREE.PlaneGeometry(2000, 2000, 5, 5);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
  var texture = THREE.ImageUtils.loadTexture(floorTexture);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(64, 64);
  material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
  var floor = new THREE.Mesh(geometry, material);
  scene.add(floor);
  floor.position.y = -20;
}

createFloor();

////////////
// skybox //
////////////
function skyConstructor() {

  // this is redundant right now, but will be important if I want different images to create a more realistic scene
  var materialArray = [];
  console.log(skyboxImg);
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skyboxImg ) }));
  for (var i = 0; i < 6; i++)
     materialArray[i].side = THREE.BackSide;
  var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyboxGeom = new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1 );
  var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
  scene.add( skybox );
  skybox.position.y = 100;
}




// make sun
function flare() {
  console.log("flare is being called");

  function addLight(scene, h, s, l) {
    // THREE.ImageUtils.crossOrigin = '';
    var textureFlare0 = THREE.ImageUtils.loadTexture('../images/flare.png');

    var flareColor = new THREE.Color( 0xffffff );
    flareColor.setHSL( h, s, l + 0.5 );
    lensFlare = new THREE.LensFlare( textureFlare0, 200, 0.0, THREE.AdditiveBlending, flareColor );
    lensFlare.position.set( -32, 22, -35 );
    scene.add( lensFlare );
    //scene.add(new THREE.PointLightHelper(fLight, 3));

  }

  addLight(scene,0.55, 0.9, 0.5);
}

function sun() {
  fLight = new THREE.PointLight( 0xDAA520, 1.8, 150 );
  //  fLight.color.setHSL( h, s, l );
  fLight.position.set( -32, 22, -35 );
  scene.add( fLight );
}

// clears the entire scene
function clearScene() {
  scene.children.forEach(function(object){
    scene.remove(object);
  });
  scene.remove(particles);
  light.intensity = 0;
  fLight.intensity = 0;
  scene.remove(lensFlare)
}


function setup() {
  skyboxImg = '../images/pixCloud.jpg';
  sun();
  flare();
  skyConstructor();
  createFloor();
}
setup();


//Sunny weather
function sunny() {
  skyboxImg = '../images/pixCloud.jpg';
  ambient();
  sun();
  flare();
  skyConstructor();
  createFloor();
}

//rainy

function makeItRain() {
  skyboxImg = '../images/stormCloud.jpg';
  ambient();
  fLight.intensity = 0.4;

  rainGeometry = new THREE.Geometry();
  for ( i = 0; i < 5000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = 1500 * Math.random() - 500;
    vertex.y = 1500 * Math.random() - 500;
    vertex.z = 1500 * Math.random() - 500;
    rainGeometry.vertices.push( vertex );
  }
  material = new THREE.ParticleBasicMaterial( { size: 2, sizeAttenuation: true, transparent: true, opacity: 0.5 } );
  material.color.setHex( 0x0000FF );
  particles = new THREE.ParticleSystem( rainGeometry, material );
  particles.sortParticles = true;
  scene.add( particles );
  particles.position.z = -680;
  particles.position.y = 30;

  skyConstructor();
  createFloor();
  function rainRender() {
    requestAnimationFrame( rainRender );
    particles.rotation.x = Date.now() * 0.0006;
  };
  rainRender();

}
//makeItRain();



//snowy

function makeItSnow() {
  skyboxImg = '../images/pixCloud.jpg';
  ambient();
  sun();
  flare();
  light.intensity = 0.835;
  fLight.intensity = 0.5;

  snowGeometry = new THREE.Geometry();
  for ( i = 0; i < 5000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = 1500 * Math.random() - 500;
    vertex.y = 1500 * Math.random() - 500;
    vertex.z = 1500 * Math.random() - 500;
    snowGeometry.vertices.push( vertex );
  }
  material = new THREE.ParticleBasicMaterial( { size: 5, sizeAttenuation: true, transparent: true, opacity: 0.5 } );
  material.color.setHex( 0xFFFFFF );
  particles = new THREE.ParticleSystem( snowGeometry, material );
  particles.sortParticles = true;
  scene.add( particles );
  particles.position.z = -680;
  particles.position.y = 35;

  skyConstructor();
  createFloor("../images/Snow.jpg");
  function snowRender() {
    requestAnimationFrame( snowRender );
    particles.rotation.x = Date.now() * 0.0002;
  };
  snowRender();

}
//makeItSnow();



//Halloween

function makeItBleed() {
  console.log("make it bleed is called")
  skyboxImg = '../images/graveyard.png';
  ambient();
  light.intensity = 0.42;
  fLight.intensity = 0;
  bloodRainGeometry = new THREE.Geometry();
  for ( i = 0; i < 5000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = 1500 * Math.random() - 500;
    vertex.y = 1500 * Math.random() - 500;
    vertex.z = 1500 * Math.random() - 500;
    bloodRainGeometry.vertices.push( vertex );
  }
  material = new THREE.ParticleBasicMaterial( { size: 2, sizeAttenuation: true, transparent: true, opacity: 0.8 } );
  material.color.setHex( 0x800020 );
  particles = new THREE.ParticleSystem( bloodRainGeometry, material );
  particles.sortParticles = true;
  scene.add( particles );
  particles.position.z = -680;
  particles.position.y = 30;

  skyConstructor();
  createFloor('../images/lava.gif');
  function bloodRainRender() {
    requestAnimationFrame( bloodRainRender );
    particles.rotation.x = Date.now() * 0.0006;
  };
  bloodRainRender();
}


//cloudy
function cloudy() {
  skyboxImg = '../images/stormCloud.jpg';
  ambient();
  light.intensity = 0.5;
  fLight.intensity = 0.44;
  skyConstructor();
  createFloor();
}



skyConstructor();
// final render loop
function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
render();

$(".textbox").focus();



$(".textbox").keypress(function (e) {
  let $textbox = $(".textbox")
  if (e.which == 13) {
    // clear the scene
    console.log("clearing scene!");
    clearScene();
    $(".weather").text("");
    $(".temp").text("");
    // lower case city
    var city = $textbox.val().toLowerCase();

    if (city == "halloween") {
      // blood rain
      makeItBleed();
      $(".weather").text("RAINING BLOOD");
      $(".temp").text("2750.00° F");
    } else if (city == "sunny") {
      sunny();
    } else if (city == "cloudy") {
      cloudy();
    } else if (city == "rainy") {
      makeItRain();
    } else if (city == "snowy") {
      makeItSnow();
    } else {
      var citySlicker = city.split(" ").join("%20");
      // make ajax api call with city
      $.ajax({
          url: `http://api.openweathermap.org/data/2.5/weather?q=${citySlicker}&APPID=9b9f5be89dd95d7d1c4eac9f9f2f235e&units=imperial`,
          method: "GET",
          success: function(data) {
            var weather = data.weather[0].main;
            if (weather == "Clear") {
              sunny();
            } else if (weather == "Thunderstorm" || weather == "Rain" || weather == "Drizzle") {
              makeItRain();
            } else if (weather == "Snow") {
              makeItSnow();
            } else if (weather == "Clouds" || weather == "Atmosphere") {
              cloudy();
            } else {
              makeItBleed();
            }

            var temp = data.main.temp;
            $(".temp").text(temp + '° F');

            $(".weather").text(weather.toUpperCase());
          }
        });
    }
    // at some point in the ajax success, reset the contents of the textbox
    $textbox.val("");
    render();
  }
})
