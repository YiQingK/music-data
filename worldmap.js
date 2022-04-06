var canvasWidth = 1000;
var canvasHeight = 700;
var margin = 300;

var svg_w = d3.select("#map")
    .append("svg")
    .attr("width",canvasWidth)
    .attr("height",canvasHeight)
    .attr("transform","translate(100,50)");

var width = canvasWidth-margin;
var height = canvasHeight-margin;

var projection = d3.geoNaturalEarth1()
    .scale(width/1.3/Math.PI)
    .translate([width/2,height/2])


d3.json("map.geojson")
    .then(function(data)
    {
        let mouseOver = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
        }

        let mouseLeave = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
        }

        svg_w.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill","#69b3a2")
            .attr("d",d3.geoPath().projection(projection))
            .attr("class", function(d){ return "Country" } )
            .style("stroke","#fff")
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
    })