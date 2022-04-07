var canvasWidth = 1000;
var canvasHeight = 700;
var margin = 300;

var svg_b = d3.select("#bump")
    .append("svg")
    .attr("width",canvasWidth)
    .attr("height",canvasHeight)
    .attr("transform","translate(200,50)");

var width = canvasWidth-margin;
var height = canvasHeight-margin;

/*Container which graph will be inside of*/
var container_b = svg_b.append("g")
    .attr("transform","translate(" + 100 + "," + 100 +")");

/*Scale for axes*/
var yScale = d3.scaleLinear().range([0,height-50]);
var xScale = d3.scaleLinear().range([50, width]);
var myColor = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

d3.csv("bump.csv").then(function(data)
{
    xScale.domain(d3.extent(data,function(d){return +d.Week;}));
    yScale.domain(d3.extent(data,function(d){return +d.Position;}));
    myColor.domain(['Bad Bunny','Taylor Swift','The Weeknd','BTS','Drake']);

    const sumstat = d3.group(data,d=>d.Singer);

    /*X axis*/
    container_b.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScale).ticks(5))
        .append("text")
        .attr("x",350)
        .attr("y",50)
        .attr("fill", "black")
        .text("Week")

    /*Y-axis*/
    container_b.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0)
        .attr("x",-150)
        .attr("dy","-5.1em")
        .attr("fill", "black")
        .text("Rank")

    container_b.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColor(d[0]) })
        .attr("stroke-width", 2)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScale(d.Week); })
                .y(function(d) { return yScale(+d.Position); })
                (d[1])
        })
    container_b.append("g")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d){return xScale(d.Week);})
        .attr("cy",function(d){return yScale(d.Position);})
        .attr("r",10)
        .style("fill",function(d){return myColor(d.Singer);})

    svg_b.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(850,100)");

    var legend = d3.legendColor()
        .shape("circle")
        .shapePadding(10)
        .scale(myColor);

    svg_b.select(".legend")
        .call(legend);
})