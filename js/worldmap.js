var width = 900;
var height = 700;

var svg_m = d3.select('#map').append('svg')
    //.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 900 700");

var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var projection = d3.geoEquirectangular();

var path = d3.geoPath()
    .projection(projection);

const mapdata = new Map();
// Load external data and boot
Promise.all([
    d3.json("./data/map.geojson"),
    d3.csv("./data/map_data.csv", function(d) {
        mapdata.set(d.Country, d)
    })]).then(function(loadData) {
    let topo = loadData[0];
    let data1 = loadData[1];

    // Draw the map
    svg_m.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", path
        )
        // set the color of each country
        .attr("fill", function(d){
            if(mapdata.get(d.properties.name))
            {
                return "#69b3a2";
            }
            else
            {
                return "black";
            }
        })
        .style("stroke", "#000")
        .attr("class", function (d) {return "Country"})
        .on("click",function(event,d){
            var dataRow = mapdata.get(d.properties.name);
            if(dataRow)
            {
                window.open(dataRow.Link);
            }
        })
        .on('mouseover', function (event, d) {
            div.transition().duration(200).style("opacity", 1);
            div.html(function(b) {
                var dataRow = mapdata.get(d.properties.name);
                if (dataRow) {
                    return d.properties.name+": "+dataRow.Song + " by " + dataRow.Singer;
                }
            })
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px");
        })
        .on('mouseout', function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

    // zoom and pan
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function(event) {
            svg_m.selectAll('path')
                .attr('transform', event.transform);
        });

    svg_m.call(zoom)

})

