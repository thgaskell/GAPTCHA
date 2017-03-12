// endpoint /api/checkpoint/lat/:param/long/:param
window.onload = function(){
  var asset = document.querySelector('a-entity[ply-model]');
  var hasBearings = null;
  var bearingIncr = 0;

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
    hasBearings = true;
  }

  function setRotation(deg){
    var bearing = -Math.floor(deg);
    asset.setAttribute('rotation', `0 0 ${bearing}`);
  }

  function leetSpin(timestamp){
    if (!hasBearings) {
      bearingIncr += 5
      asset.setAttribute('rotation', `0 0 ${-bearingIncr}`);
      window.requestAnimationFrame(leetSpin)
    }
  }

  window.requestAnimationFrame(leetSpin);
}
