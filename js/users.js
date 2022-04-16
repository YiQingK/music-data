var canvasWidth = 1000;
var canvasHeight = 700;
var margin = 300;

/*Create SVG tag with specified width and height*/
var svg_u = d3.select("#users").append("svg")
    .attr("width",canvasWidth)
    .attr("height",canvasHeight)
    .attr("transform","translate(200,0)");

/*Data to keep within margin*/
var width = canvasWidth - margin;
var height = canvasHeight - margin;

/*Container which graph will be inside of*/
var container_u = svg_u.append("g")
    .attr("transform","translate(" + 100 + "," + 100 +")");

/*Scale for axes*/
var yScaleU = d3.scaleLinear().range([height, 0]);
var xScaleU = d3.scaleTime().range([0, width]);
var myColor = d3.scaleOrdinal().range(['#e41a1c','#4daf4a']);

d3.csv("./data/users.csv",function (d) {return {date: d3.timeParse("%m/%d/%Y")(d.date), type: d.type, number: +d.number,}})
    .then(function (data)
    {
        yScaleU.domain(d3.extent(data,function (d){return +d.number;}));
        xScaleU.domain(d3.extent(data,function (d){return d.date;}));
        myColor.domain(['apple','spotify']);

        const sumstat = d3.group(data,d=>d.type);

        /*X axis*/
        container_u.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScaleU).tickFormat(d3.timeFormat("20%y")))
            .append("text")
            .attr("x",350)
            .attr("y",50)
            .attr("fill", "black")
            .text("Date")

        /*Y-axis gridline*/
        container_u.append("g")
            .call(d3.axisLeft(yScaleU).tickSize(-width).tickFormat(""))
            .attr("stroke-opacity",0.1)

        /*Y-axis*/
        container_u.append("g")
            .call(d3.axisLeft(yScaleU))
            .append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0)
            .attr("x",-150)
            .attr("dy","-5.1em")
            .attr("fill", "black")
            .text("Users in millions")

        container_u.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return myColor(d[0]) })
            .attr("stroke-width", 2)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return xScaleU(d.date); })
                    .y(function(d) { return yScaleU(+d.number); })
                    (d[1])
            })

        svg_u.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(850,100)");

        var legend = d3.legendColor()
            .shape("line")
            .shapePadding(10)
            .scale(myColor);

        svg_u.select(".legend")
            .call(legend);
    });