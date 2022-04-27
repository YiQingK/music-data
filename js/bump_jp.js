var canvasWidth = 1000;
var canvasHeight = 500;
var marginH = 100;
var marginW = 300;

var svg_b_j = d3.select("#bump_jp")
    .append("svg")
    .attr("viewBox", "0 0 1000 500");

var width = canvasWidth-marginW;
var height = canvasHeight-marginH;

/*Container which graph will be inside of*/
var container_b_j = svg_b_j.append("g")
    .attr("transform","translate(" + 100 + "," + 50 +")");

/*Scale for axes*/
var yScaleB_J = d3.scaleLinear().range([0,height-50]);
var xScaleB_J = d3.scaleLinear().range([50, width]);
var myColorB_J = d3.scaleOrdinal().range(['#984ea3','#ff6699','#ffcc66','#ff3300','#000099','#00cc99']);

d3.csv("./data/bump_jp.csv").then(function(data)
{
    xScaleB_J.domain(d3.extent(data,function(d){return +d.Week;}));
    yScaleB_J.domain(d3.extent(data,function(d){return +d.Position;}));
    myColorB_J.domain(['BTS','YOASOBI','King GNU','Vaundy','Yuuri','Official HIGE DANdism']);

    const sumstat = d3.group(data,d=>d.Singer);

    /*X axis*/
    container_b_j.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScaleB_J).ticks(5))
        .append("text")
        .attr("x",350)
        .attr("y",50)
        .attr("fill", "black")
        .text("Week")

    /*Y-axis*/
    container_b_j.append("g")
        .call(d3.axisLeft(yScaleB_J).ticks(5))
        .append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0)
        .attr("x",-150)
        .attr("dy","-5.1em")
        .attr("fill", "black")
        .text("Rank")

    function hover(elem) {
        var id = elem.srcElement.__data__.substring(0,3).toUpperCase();

        container_b_j.selectAll('.line').attr("stroke","grey").attr("opacity",0.1);
        container_b_j.selectAll('.dot').style("fill","grey").attr("opacity",0.1);
        container_b_j.select('#'+id).attr('stroke', d => {return myColorB_J(d[0])}).attr("opacity",1);
        container_b_j.selectAll('#'+id+'.dot').style('fill', d => {return myColorB_J(d.Singer)}).attr("opacity",1);
    }

    function exit(elem) {
        container_b_j.selectAll('.line').attr('stroke', d => {return myColorB_J(d[0])}).attr("opacity",1);
        container_b_j.selectAll('.dot').style('fill', d => {return myColorB_J(d.Singer)}).attr("opacity",1);
    }

    container_b_j.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("class","line")
        .attr("fill", "none")
        .attr("stroke", function(d){ return myColorB_J(d[0]) })
        .attr("stroke-width", 5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScaleB_J(d.Week); })
                .y(function(d) { return yScaleB_J(+d.Position); })
                (d[1])
        })
        .attr("id",function(d){return (d[0].substring(0,3).toUpperCase());})
        .attr("opacity",1);

    container_b_j.append("g")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("id",function(d){return d.Singer.substring(0,3).toUpperCase();})
        .attr("cx",function(d){return xScaleB_J(d.Week);})
        .attr("cy",function(d){return yScaleB_J(d.Position);})
        .attr("r",10)
        .style("fill",function(d){return myColorB_J(d.Singer);})
        .attr("opacity",1);

    svg_b_j.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(850,100)");

    var legend = d3.legendColor()
        .shape("circle")
        .shapePadding(10)
        .labelWrap(100)
        .scale(myColorB_J)
        .on("cellover",hover)
        .on('cellout',exit);

    svg_b_j.select(".legend")
        .call(legend);
})
