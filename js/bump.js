var canvasWidth = 1000;
var canvasHeight = 500;
var marginH = 100;
var marginW = 300;

var svg_b = d3.select("#bump")
    .append("svg")
    .attr("viewBox", "0 0 1000 500");

var width = canvasWidth-marginW;
var height = canvasHeight-marginH;

/*Container which graph will be inside of*/
var container_b = svg_b.append("g")
    .attr("transform","translate(" + 100 + "," + 50 +")");

/*Scale for axes*/
var yScaleB = d3.scaleLinear().range([0,height-50]);
var xScaleB = d3.scaleLinear().range([50, width]);
var myColorB = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#cc9900','#cc0099','#003300']);

d3.csv("./data/bump.csv").then(function(data)
{
    xScaleB.domain(d3.extent(data,function(d){return +d.Week;}));
    yScaleB.domain(d3.extent(data,function(d){return +d.Position;}));
    myColorB.domain(['Bad Bunny','Taylor Swift','The Weeknd','BTS','Drake','Justin Bieber','Ed Sheeran','Daddy Yankee']);

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

    function hover(elem) {
        var id = elem.srcElement.__data__.substring(0,2).toUpperCase();

        container_b.selectAll('.line').attr("stroke","grey");
        container_b.selectAll('.dot').style("fill","grey");
        container_b.select('#'+id).attr('stroke', d => {return myColorB(d[0])});
        container_b.selectAll('#'+id+'.dot').style('fill', d => {return myColorB(d.Singer)});
    }

    function exit(elem) {
        container_b.selectAll('.line').attr('stroke', d => {return myColorB(d[0])});
        container_b.selectAll('.dot').style('fill', d => {return myColorB(d.Singer)});
    }

    container_b.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("class","line")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorB(d[0]) })
        .attr("stroke-width", 5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScaleB(d.Week); })
                .y(function(d) { return yScaleB(+d.Position); })
                (d[1])
        })
        .attr("id",function(d){return (d[0].substring(0,2).toUpperCase());});

    container_b.append("g")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("id",function(d){return d.Singer.substring(0,2).toUpperCase();})
        .attr("cx",function(d){return xScaleB(d.Week);})
        .attr("cy",function(d){return yScaleB(d.Position);})
        .attr("r",10)
        .style("fill",function(d){return myColorB(d.Singer);});

    svg_b.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(850,100)");

    var legend = d3.legendColor()
        .shape("circle")
        .shapePadding(10)
        .scale(myColorB)
        .on("cellover",hover)
        .on('cellout',exit);

    svg_b.select(".legend")
        .call(legend);
})
