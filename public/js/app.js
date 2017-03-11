console.log('check')

// endpoint /api/checkpoint/lat/:param/long/:param
window.onload = function(){
  var geo = navigator.geolocation;
  geo.getCurrentPosition(function (position) {
    sendLocation(position.coords.latitude, position.coords.longitude)
  })

  function sendLocation(lat, lng) {
    var req = new XMLHttpRequest();
    req.addEventListener('load', receiveRotation);
    req.open('POST', `/api/checkpoint/lat/${lat}/long/${lng}`)
    req.send();
  }

  function receiveRotation(){
    console.log(this.responseText)
  }

}
