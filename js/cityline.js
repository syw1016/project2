var la_county_cities = [
  "Los Angeles","Pasadena","Santa Monica","Monrovia","Pomona","Long Beach","South Pasadena","Compton","Redondo Beach","Whittier"
  ,"Azusa","Covina","Alhambra","Arcadia","Vernon","Glendale","Huntington Park","La Verne","Hermosa Beach","Sierra Madre","Claremont"
  ,"Inglewood","Burbank","San Fernando","Glendora","El Monte","Manhattan Beach","San Gabriel","San Marino","Avalon","Beverly Hills"
  ,"Monterey Park","El Segundo","Culver City","Montebello","Torrance","Lynwood","Hawthorne","South Gate","West Covina","Signal Hill"
  ,"Maywood","Bell","Gardena","Palos Verdes Estates","Lakewood","Baldwin Park","Cerritos","La Puente","Downey","Rolling Hills","Paramount"
  ,"Santa Fe Springs","Industry","Bradbury","Irwindale","Duarte","Norwalk","Bellflower","Rolling Hills Estates","Pico Rivera","South El Monte"
  ,"Walnut","Artesia","Rosemead","Lawndale","Commerce","La Mirada","Temple City","San Dimas","Cudahy","Bell Gardens"
  ,"Hidden Hills","Palmdale","Hawaiian Gardens","Lomita","Carson","Rancho Palos Verdes","La Canada-Flintridge","Lancaster"
  ,"La Habra Heights","Westlake Village","Agoura Hills","West Hollywood","Santa Clarita","Diamond Bar","Malibu","Calabasas"
  ]

la_county_cities.forEach(e => {
  $("#searchable").append(`<option value="${e}">${e}</option>`);
})

function drawCityLine() {
  var svg = d3.select("#cityline"),
      margin = {top: 20, right: 120, bottom: 80, left: 60},
      width = parseInt(svg.style("width")) - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m");

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")).ticks(d3.timeMonth, 3),
      yAxis = d3.axisLeft(y);

  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.hvi); });

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("LA_County_HVI.csv", d => d).then(data => {
    let cities = data.slice();
    let timeframe = data.columns.slice(159);
    let cityNames = cities.map(e => e.RegionName)
    let datum = timeframe.map(e => {
      let obj = {};
      obj.date = e;
      cities.map(city => {
        obj[city.RegionName] = +city[e];
      })
      return obj;
    });

    realData = cityNames.map(id => {
      return {
        id: id,
        values: datum.map(row => {
          return {
            date: parseTime(row.date),
            hvi: row[id]
          }
        })
      };
    });

    x.domain(d3.extent(timeframe.map(e => parseTime(e))));
    y.domain([
      d3.min(cities, city => d3.min(timeframe.map(date => +city[date]))),
      d3.max(cities, city => d3.max(timeframe.map(date => +city[date])))
    ]);
    z.domain(cities.map(function(c) { return c.id; }));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("dx", "-3em")
        .attr("dy", "1em")
        .attr("transform", function(d) {
          return "rotate(-90)"
        });

    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Home Value Index ($)");

    var city = g.selectAll(".city")
      .data(realData)
      .enter()
      .append("g")
      .attr("class", "city")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-'); });

    city.append("path")
      .attr("class", "line")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-') + "-line"; } )
      .attr("d", function(d) { return line(d.values.filter(e => e.hvi != 0)); })
      .style("stroke", function(d) { return z(d.id); });

    city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.hvi) + ")"; })
      .attr("x", 3)
      .attr("class", "line-tag")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-') + "-tag"; })
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
    })
}

drawCityLine();