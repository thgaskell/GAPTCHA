// endpoint /api/checkpoint/lat/:param/long/:param
window.onload = function(){
  var geo = navigator.geolocation;
  geo.getCurrentPosition(function (position) {
    sendLocation(position.coords.latitude, position.coords.longitude)
  })

  function sendLocation(lat, lng) {
    var req = new XMLHttpRequest();
    req.addEventListener('load', receiveRotation);
    req.open('GET', `/api/checkpoint/lat/${lat}/long/${lng}`)
    req.send();
  }

  function receiveRotation(){
    console.log(this.responseText)
    var response = JSON.parse(this.responseText)
    setRotation(response.finalBearing)
  }

  function setRotation(deg){
    var bearing = -Math.floor(deg);
    var asset = document.querySelector('a-entity[ply-model]');
    asset.setAttribute('rotation', `0 0 ${bearing}`);
  }
}
