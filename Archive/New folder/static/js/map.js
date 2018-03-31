var map = L.map('map').setView([37.8, -99], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,

  id: 'mapbox.light'
}).addTo(map);

var stripes = new L.StripePattern({
  angle: 45,
  weight: 5,
  opacity: 0.3,
});
stripes.addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h5>Home Value Index Change</h5>' +  (props ?
    '<b>' + props.name + '</b><br /> $' + props.density
    : 'Hover over a state');
};

info.addTo(map);

// get color depending on population density value
function getColor(d) {
  return d > 1000 ? '#800026' :
      d > 500  ? '#BD0026' :
      d > 200  ? '#E31A1C' :
      d > 100  ? '#FC4E2A' :
      d > 50   ? '#FD8D3C' :
      d > 20   ? '#FEB24C' :
      d > 10   ? '#FED976' :
            '#FFEDA0';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;
var selectedStates = [];

function resetHighlight(e) {
  var layer = e.target;
  var layerIndex = selectedStates.indexOf(layer);
  if(layerIndex === -1) {
    geojson.resetStyle(layer);
    info.update();
  } else {
    geojson.resetStyle(layer);
    layer.setStyle({
    fillPattern: stripes
    });
    info.update();
  }
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function drawLine(e) {
  var layer = e.target;
  var layerIndex = selectedStates.indexOf(layer);
  let selectedState = layer.feature.properties.name.toLowerCase().replace(/ /g,'-');
  console.log(selectedState);
  if(layerIndex === -1) {
    selectedStates.push(layer);
    geojson.resetStyle(layer);
    layer.setStyle({
      fillPattern: stripes
    });
    $('#'+selectedState+"-line").toggle({duration: 3000});
    $('#'+selectedState+"-tag").toggle({duration: 3000});
  } else {
    selectedStates.splice(layerIndex, 1);
    geojson.resetStyle(layer);
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    $('#'+selectedState+"-line").toggle({duration: 3000});
    $('#'+selectedState+"-tag").toggle({duration: 3000});
  }
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: drawLine
  });
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Home Value Index data &copy; <a href="https://www.zillow.com/research/data/">Zillow</a>');

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);