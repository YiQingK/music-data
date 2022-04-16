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
var yScaleB = d3.scaleLinear().range([0,height-50]);
var xScaleB = d3.scaleLinear().range([50, width]);
var myColorB = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']);

d3.csv("./data/bump.csv").then(function(data)
{
    xScaleB.domain(d3.extent(data,function(d){return +d.Week;}));
    yScaleB.domain(d3.extent(data,function(d){return +d.Position;}));
    myColorB.domain(['Bad Bunny','Taylor Swift','The Weeknd','BTS','Drake']);

    const sumstat = d3.group(data,d=>d.Singer);

    /*X axis*/
    container_b.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScaleB).ticks(5))
        .append("text")
        .attr("x",350)
        .attr("y",50)
        .attr("fill", "black")
        .text("Week")

    /*Y-axis*/
    container_b.append("g")
        .call(d3.axisLeft(yScaleB).ticks(5))
        .append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0)
        .attr("x",-150)
        .attr("dy","-5.1em")
        .attr("fill", "black")
        .text("Rank")

    /*function hover(elem) {
        // Add code here for 'hover'
        var attrs = elem.srcElement.attributes;
        let id = attrs['data-id'].value;
        let path = city.select('#' + id);
        if(path.attr('visibility')=='visible')
        {
            city.selectAll('.line').style("stroke","grey").attr("opacity",0.1);
            path.style("stroke", d=>{return z(d.id)}).attr("opacity",1);
        }
    }

    function exit(elem) {
        var attrs = elem.srcElement.attributes;
        let id = attrs['data-id'].value;
        let path = city.select('#' + id);
        if (path.attr('visibility') == 'hidden') {
            return;
        }
        city.selectAll('.line').style('stroke', d => {
            return z(d.id)
        }).attr("opacity",0.85);
    }*/

    container_b.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorB(d[0]) })
        .attr("stroke-width", 2)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScaleB(d.Week); })
                .y(function(d) { return yScaleB(+d.Position); })
                (d[1])
        })
    container_b.append("g")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d){return xScaleB(d.Week);})
        .attr("cy",function(d){return yScaleB(d.Position);})
        .attr("r",10)
        .style("fill",function(d){return myColorB(d.Singer);})

    svg_b.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(850,100)");

    var legend = d3.legendColor()
        .shape("circle")
        .shapePadding(10)
        .scale(myColorB)
        .on("mouseover",hover)
        .on('mouseout',exit);

    svg_b.select(".legend")
        .call(legend);
})
