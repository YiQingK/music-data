var width = 900;
var height = 700;

var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("transform","translate(200,0)");

var projection = d3.geoEquirectangular()

const mapdata = new Map();
// Load external data and boot
Promise.all([
    d3.json("map.geojson"),
    d3.csv("map_data.csv", function(d) {
        mapdata.set(d.Country, d)
    })]).then(function(loadData) {
    let topo = loadData[0]

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", "#69b3a2")
        .style("stroke", "#000")
        .attr("class", function (d) {return "Country"})
        .style("opacity", .8)
        .on('mouseover', function (event, d) {
            div.transition().duration(200).style("opacity", 1);
            div.html(function(b) {
                var dataRow = mapdata.get(d.properties.name);
                if (dataRow) {
                    console.log(dataRow);
                    return d.properties.name+": "+dataRow.Singer + ", " + dataRow.Song;
                } else {
                    console.log("no dataRow", b);
                    return d.properties.name + ": No data.";
                }
            })
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

})

