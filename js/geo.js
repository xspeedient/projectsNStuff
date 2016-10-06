//API key: AIzaSyAFVxqJcmPnOGddusjZyXFf8lyxlqp_JBY
function initialize(){
  initMap();
}

var map;
var coordinates;

function initMap() {

  console.log('im working')
 map = new google.maps.Map(document.getElementById('map'), {
   center: {lat: 37.774, lng: -122.419},
   zoom: 8
 });
 var infoWindow = new google.maps.InfoWindow({map: map});

 // Try HTML5 geolocation.
 if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function(position) {
     var pos = {
       lat: position.coords.latitude,
       lng: position.coords.longitude
     };

     console.log("Your Location: " + "latitude " + pos.lat + " longitude: " + pos.lng);

     lat1 = pos.lat
     lng1 = pos.lng

     // console.log(lat1)

     infoWindow.setPosition(pos);
     infoWindow.setContent('Location found.');
     map.setCenter(pos);
   }, function() {
     handleLocationError(true, infoWindow, map.getCenter());

     // let lat1 = pos.lat
     // let lat2 = pos.lng

   });
 } else {
   // Browser doesn't support Geolocation
   handleLocationError(false, infoWindow, map.getCenter());
 }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
 infoWindow.setPosition(pos);
 infoWindow.setContent(browserHasGeolocation ?
                       'Error: The Geolocation service failed.' :
                       'Error: Your browser doesn\'t support geolocation.');
}
