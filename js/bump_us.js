var canvasWidth = 1000;
var canvasHeight = 500;
var marginH = 100;
var marginW = 300;

/*Create SVG tag with specified width and height*/
var svg_b_u = d3.select("#bump_us")
    .append("svg")
    .attr("viewBox", "0 0 1000 500");

/*Data to keep within margin*/
var width = canvasWidth-marginW;
var height = canvasHeight-marginH;

/*Container which graph will be inside of*/
var container_b_u = svg_b_u.append("g")
    .attr("transform","translate(" + 100 + "," + 25 +")");

/*Scale for axes and color*/
var yScaleB_U = d3.scaleLinear().range([0,height-50]);
var xScaleB_U = d3.scaleLinear().range([50, width]);
var myColorB_U = d3.scaleOrdinal().range(['#e41a1c','#ff7f00','#006600','#377eb8','#990099','#a65628']);

d3.csv("./data/bump_us.csv").then(function(data)
{
    xScaleB_U.domain(d3.extent(data,function(d){return +d.Week;}));
    yScaleB_U.domain(d3.extent(data,function(d){return +d.Position;}));
    myColorB_U.domain(['Bad Bunny','Drake','Kanye West','Taylor Swift','Juice WRLD','Jack Harlow']);

    const sumstat = d3.group(data,d=>d.Singer);

    /*X axis*/
    container_b_u.append("g")
        .style("font-size","25px")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScaleB_U).ticks(5))
        .append("text")
        .attr("x",375)
        .attr("y",65)
        .attr("fill", "black")
        .text("Week")
        .attr("font-size",25)

    /*Y-axis*/
    container_b_u.append("g")
        .style("font-size","25px")
        .call(d3.axisLeft(yScaleB_U).ticks(5))
        .append("text")
        .attr("transform","rotate(-90)")
        .attr("y",75)
        .attr("x",-150)
        .attr("dy","-5.1em")
        .attr("fill", "black")
        .text("Rank")
        .attr("font-size",25)

    /*When mouseover legend*/
    function hover(elem) {
        var id = elem.srcElement.__data__.substring(0,3).toUpperCase();

        container_b_u.selectAll('.line').attr("stroke","grey");
        container_b_u.selectAll('.dot').style("fill","grey");
        container_b_u.select('#'+id).attr('stroke', d => {return myColorB_U(d[0])});
        container_b_u.selectAll('#'+id+'.dot').style('fill', d => {return myColorB_U(d.Singer)});
    }

    /*When mouseout legend*/
    function exit(elem) {
        container_b_u.selectAll('.line').attr('stroke', d => {return myColorB_U(d[0])});
        container_b_u.selectAll('.dot').style('fill', d => {return myColorB_U(d.Singer)});
    }

    /*Draws line*/
    container_b_u.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("class","line")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorB_U(d[0]) })
        .attr("stroke-width", 5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScaleB_U(d.Week); })
                .y(function(d) { return yScaleB_U(+d.Position); })
                (d[1])
        })
        .attr("id",function(d){return (d[0].substring(0,3).toUpperCase());});

    /*Draws circle*/
    container_b_u.append("g")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("id",function(d){return d.Singer.substring(0,3).toUpperCase();})
        .attr("cx",function(d){return xScaleB_U(d.Week);})
        .attr("cy",function(d){return yScaleB_U(d.Position);})
        .attr("r",10)
        .style("fill",function(d){return myColorB_U(d.Singer);});

    /*Legend*/
    svg_b_u.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(850,100)");

    var legend = d3.legendColor()
        .shape("circle")
        .shapePadding(10)
        .scale(myColorB_U)
        .on("cellover",hover)
        .on('cellout',exit);

    svg_b_u.select(".legend")
        .call(legend);
})
