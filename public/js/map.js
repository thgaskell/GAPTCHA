window.onload = function (){
  getCheckPoints();
};
function getCheckPoints() {
  var req = new XMLHttpRequest();
  req.addEventListener('load', receiveData);
  req.open('GET', `/api/checkpoint`);
  req.send();
}

function receiveData(){
  let data = JSON.parse(this.responseText).json.values;
  addPointsToMap(data);
}

function addPointsToMap(data) {
  // let parsedData = JSON.parse(data[0].values['check-points']);
  data.map((point, i) => {
    let parsedData = JSON.parse(point.values['check-points']);
    let lat = parsedData.lat;
    let lon = parsedData.lon;
    // Add points from M2X on the map
    if (lat || lon) {
      var customIcon = L.icon({
        iconUrl: 'img/favicon-32x32.png'
      });
      var marker = L.marker([lat, lon], { icon: customIcon }).addTo(mymap);
      marker.bindPopup(`<b>Timestamp</b><br>${new Date(parsedData.timestamp)}.`);
    }
  });
}

var mymap = L.map('mapid').setView([21.2858534, -157.8064349], 15);

L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

// https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

