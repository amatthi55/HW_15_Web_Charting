
// grab earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", createMarkers);

function createMarkers(response) {
  
  var quakes = response.features;

  var quakeCircles = [];

  //magnitude of earthquakes
  var mags = []
  // loop through the quakes array
  for (var index = 0; index < quakes.length; index++) {
    var quake = quakes[index].geometry.coordinates;
    var mag = quakes[index].properties.mag;
    var mag_c = quakes[index].properties.mag ** 3
    var text = "Magnitude: " + quakes[index].properties.mag + ",   Location: " + quakes[index].properties.place
   
    // for each earthquake, create a circle and bind a popup with earthquake info
    var quakeCircle = L.circle([quake[1], quake[0]], 6000 * mag**2 ,{color: getColor(mag_c) ,opacity:1,fillColor: getColor(mag_c),fillOpacity: 1}).bindPopup(text)
     
    quakeCircles.push(quakeCircle);
  }

  
  createMap(L.layerGroup(quakeCircles));
}

function createMap(seismic_events) {

  // create the main layer that will be the background of our map
  var mainmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0dGhpZXNzZW4xIiwiYSI6ImNqaWdrZW0yZTE4Y24zbHQ0NW9rcjQ4ZjcifQ.bE6MCo3nLcAS5N3oaPQoCw", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
  });

  // Create the map object 
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [mainmap, seismic_events]
  });


  // create a legend for the colors
    
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [90 ** (1/3), 110 ** (1/3), 130 ** (1/3), 150 ** (1/3), 170 ** (1/3), 180 ** (1/3)],
          labels = [];

      // loop through our earthquake grades and generate a label with a colored square for each grade
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i]**3 + 1) + '"></i> ' +
              (Math.round( grades[i] * 10 ) / 10) + ( (Math.round( grades[i + 1]  * 10 ) / 10)? '&ndash;' + (Math.round( grades[i + 1]  * 10 ) / 10) + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(map);
}


//used to create earthquake color scale
function getColor(d) {
  return d > 180  ? '#BD0026' :
         d > 170  ? '#E31A1C' :
         d > 150  ? '#FC4E2A' :
         d > 130  ? '#FD8D3C' :
         d > 110   ? '#FEB24C' :
         d > 90   ? '#FED976' :
                    '#FFEDA0';
}

