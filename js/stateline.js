function drawStateline(states) {
  let svg = d3.select("#stateline"),
      margin = {top: 20, right: 65, bottom: 40, left: 60},
      width = parseInt(svg.style("width")) - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;


  let parseTime = d3.timeParse("%Y-%m");

  let x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  let xAxis = d3.axisBottom(x),
      yAxis = d3.axisLeft(y);

  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.hvi); });

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("State_Zhvi_AllHomes.csv", d => d).then(data => {
    let states = data.slice();
    let timeframe = data.columns.slice(3);
    let stateNames = states.map(e => e.RegionName)

    let datum = timeframe.map(e => {
      let obj = {};
      obj.date = e;
      states.map(state => { obj[state.RegionName] = +state[e]; });
      return obj;
    });

    let realData = stateNames.map(id => {
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

    console.log(realData);
    x.domain(d3.extent(timeframe.map(e => parseTime(e))));
    y.domain([
      d3.min(states, state => d3.min(timeframe.map(date => +state[date]))),
      d3.max(states, state => d3.max(timeframe.map(date => +state[date])))
    ]);
    z.domain(states.map(function(c) { return c.id; }));

    g.append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + height + ")")

    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Home Value Index ($)");

    var state = g.selectAll(".state")
      .data(realData)
      .enter()
      .append("g")
      .attr("class", "state")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-'); });

    state.append("path")
      .attr("class", "line")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-') + "-line"; } )
      .attr("d", function(d) { return line(d.values.filter(e => e.hvi != 0)); })
      .style("stroke", function(d) { return z(d.id); });

    state.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.hvi) + ")"; })
      .attr("x", 3)
      .attr("class", "line-tag")
      .attr("id", function(d) { return d.id.toLowerCase().replace(/ /g,'-') + "-tag"; })
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
  });
}

drawStateline();
