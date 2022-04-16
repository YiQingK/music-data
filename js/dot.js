var canvasWidth = 1000;
var canvasHeight = 700;
var margin = 300;


var svg_l = d3.select("#lollipop")
    .append("svg")
    .attr("width",canvasWidth)
    .attr("height",canvasHeight)
    .attr("transform","translate(200,0)");

var width = canvasWidth-margin;
var height = canvasHeight-margin;

var container_l = svg_l.append("g").attr("transform","translate(100,100)");

var x = d3.scaleLinear().range([0,width])
var y = d3.scaleBand().range([height,0])


d3.csv("./data/test_data.csv").then(function(data)
{
    // sort data
    data.sort(function(b, a) {
        return b.streams - a.streams;
    });

    x.domain([0,d3.max(data, function (d){return +d.streams})]);
    y.domain(data.map(function(d){return d.track_name;}))

    container_l.append("g")
        .attr("transform", "translate(75, " + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    container_l.append("g")
        .call(d3.axisLeft(y))
        .attr("transform","translate(75,0)")

    container_l.selectAll("myline")
        .data(data)
        .join("line")
        .attr("transform","translate(75,20)")
        .attr("x1", function(d) { return x(d.streams); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.track_name); })
        .attr("y2", function(d) { return y(d.track_name); })
        .attr("stroke", "grey")

    container_l.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("transform","translate(75,20)")
        .attr("cx",function(d){return x(d.streams);})
        .attr("cy",function(d){return y(d.track_name);})
        .attr("r",7.5)
        .style("stroke","black")
        .style("fill","#92a8d1")


})