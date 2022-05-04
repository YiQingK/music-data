var canvasWidth = 1000;
var canvasHeight = 600;
var margin = 150;

/*Create SVG tag with specified width and height*/
var svg_u = d3.select("div#users").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 600");

/*Data to keep within margin*/
var width = canvasWidth - margin;
var height = canvasHeight - margin;

/*Container which graph will be inside of*/
var container_u = svg_u.append("g")
    .attr("transform","translate(" + 100 + "," + 10 +")");

/*Scale for axes*/
var yScaleU = d3.scaleLinear().range([height, 0]);
var xScaleU = d3.scaleLinear().range([0, width]);
var myColor = d3.scaleOrdinal().range(['#4daf4a','#e41a1c']);

d3.csv("./data/user_data.csv",/*function (d) {return {date: d3.timeParse("%m/%d/%Y")(d.date), type: d.type, number: +d.number,}}*/)
    .then(function (data)
    {
        yScaleU.domain([0,165]);
        xScaleU.domain(['2016','2021']);
        myColor.domain(['spotify','apple']);

        const sumstat = d3.group(data,d=>d.type);

        /*X axis*/
        container_u.append("g")
            .style("font-size","25px")
            .attr("transform", "translate(0, " + 500 + ")")
            .call(d3.axisBottom(xScaleU).tickFormat(d3.format("d")).ticks(6))
            .append("text")
            .attr("x",425)
            .attr("y",50)
            .attr("fill", "black")
            .text("Year")
            .attr("font-size",25)

        /*Y-axis gridline*/
        container_u.append("g")
            .call(d3.axisLeft(yScaleU).tickSize(-canvasWidth).tickFormat(""))
            .attr("stroke-opacity",0.1)

        /*Y-axis*/
        container_u.append("g")
            .style("font-size","25px")
            .call(d3.axisLeft(yScaleU))
            .append("text")
            .attr("transform","rotate(-90)")
            .attr("y",40)
            .attr("x",-150)
            .attr("dy","-5.1em")
            .attr("dx",-25)
            .attr("fill", "black")
            .text("Users in millions")
            .attr("font-size",20)

        container_u.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return myColor(d[0]) })
            .attr("stroke-width", 3)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return xScaleU(d.date); })
                    .y(function(d) { return yScaleU(+d.number); })
                    (d[1])
            })

        container_u.append("text")
            .attr("font-family","sans-serif")
            .attr("font-size",20)
            .attr("font-weight","bold")
            .attr("fill",'#4daf4a')
            .attr("transform","translate(830,35)")
            .text("Spotify")

        container_u.append("text")
            .attr("font-family","sans-serif")
            .attr("font-size",20)
            .attr("font-weight","bold")
            .attr("fill",'#e41a1c')
            .attr("transform","translate(780,255)")
            .text("Apple Music")
    });