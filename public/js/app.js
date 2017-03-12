// endpoint /api/checkpoint/capture/lat/:param/long/:param
window.onload = function (){
  console.log('Welcome to GAPTCHA!')
  var geo = navigator.geolocation;

  var winBtn = document.getElementById('win-button');
  winBtn.addEventListener('click', function (evt){
    geo.getCurrentPosition(function (position) {
      winnahwinnah(position.coords.latitude, position.coords.longitude)
    })
  })

  function winnahwinnah(lat, lng){
    var req = new XMLHttpRequest();
    req.open('GET', `/api/checkpoint/capture/lat/${lat}/long/${lng}`)
    req.send();

  }
}
