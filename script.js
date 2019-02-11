
var data = [
    { tir: 'APPOINT', start: '2018-03-02T00:00:00', end: '2018-03-05T00:00:00', color: '#8dc641'},
    { tir: 'TRANSPORT', start: '2018-03-01T00:00:00', end: '2018-03-12T00:00:00'},
    { tir: 'APPOINT', start: '2018-03-10T00:00:00', end: '2018-03-25T00:00:00', color: '#8dc641'},
    { tir: 'MYMEDS', start: '2018-03-11T00:00:00', end: '2018-03-25T00:00:00'},
    { tir: 'TELECATH', start: '2018-03-12T00:00:00', end: '2018-03-29T00:00:00'}        
  ]
  var w = 500;
  var h = 300;
  var margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
  };
  var padding_left = 50; 
  var width = w - margin.left - margin.right - padding_left;
  var height = h - margin.top - margin.bottom;
  // var x = d3.scaleLinear()
  //         .domain([0, d3.max(data, function(d){
  //             return d.value;
  //         })])
  //         .range([0, width]);
  var x = d3.scaleTime()
          .domain([d3.isoParse('2018-03-01T00:00:00'), d3.isoParse('2018-04-12T00:00:00')])
          .range([0, width]);
  var y = d3.scaleBand()
          .domain(data.map(function(entry){
              return entry.tir;
          }))
          .range([height, 0])
          .padding(0.1);
  
  var svg = d3.select("body").append("svg")
              .attr("id", "chart")
              .attr("width", w)
              .attr("height", h);
  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + (padding_left) + "," + 0 + ")");
  
  var chart = svg.append("g")
              .classed("display", true)
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  
  
  var zoomed = function zoomed() {
  
    var t = d3.event.transform; 
  //   console.log(t)
    var chart = d3.select(this.parentNode); 
   console.log(this.parentNode)
    var newX = t.rescaleX(x);
    xAxis.scale(newX); 
    svg.select('.x--axis').call(xAxis);
  
    svg.selectAll('.bar')
      .attr("x", function(d) { 
        return t.applyX(xValue(d)) + padding_left;
      })  
      .attr("width", function(d){
        return t.k * barWidth(d);
      });
  
  }
  
  var zoom = d3.zoom()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);
  
  
  var xValue = function (d) {
    return x(d3.isoParse(d.start));
  }
  
  var barWidth = function (d) {
    return x(d3.isoParse(d.end)) - x(d3.isoParse(d.start));
  }
  var yAxis = d3.axisLeft(y);
  var xAxis = d3.axisBottom(x).ticks(width/100);
  
  function plot(params){
      this.append('g')
      .attr('class', 'chart-area')
      .selectAll(".bar")
          .data(params.data)
          .enter()
              .append("rect")
              .classed("bar", true)
              .attr("x", function(d) { 
                        return xValue(d) + padding_left;
              })
              .attr("y", function(d,i){
                  return y(d.tir);
              })
              .attr("height", y.bandwidth())
              .attr("width", function(d){
                  return barWidth(d);
              })
              .attr("fill", function(d){
                  return d.color || '#ddf';
              });
  
      this.append("g").attr("class", "x--axis")
      .attr("transform", "translate(" + padding_left + "," + height + ")")
      .call(xAxis);    
  
      this.append("g").attr("class", "y--axis")
      .attr("transform", "translate(" + padding_left + ",0)")
      .call(yAxis);
  
      //zoom
      svg.append('rect')
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + (padding_left + margin.left) + "," + margin.top + ")")
      // .attr("transform", "translate(" + padding_left + "," + 0 + ")")    
      .call(zoom);
  }
  plot.call(chart, {data: data});