var canvasWidth = 1000;
var canvasHeight = 500;
var marginH = 100;
var marginW = 300;
var marginL = 200;

/*Create SVG tag with specified width and height*/
var svg_l = d3.select("div#lollipop")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500");

/*Create div tag for tooltip*/
var div = d3.select("div#lollipop").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/*Data to keep within margin*/
var width = canvasWidth-marginW;
var height = canvasHeight-marginH;

var container_l = svg_l.append("g");

/*X-axis*/
var x = d3.scaleLinear().range([0,width]);
var xAxis = container_l.append("g")
            .attr("transform", "translate(250, 400)");

/*Y-axis*/
var y = d3.scaleBand().range([400,0]);
var yAxis = container_l.append("g")
            .attr("transform","translate(250,0)");

/*To format tooltip number*/
var formatNum = d3.format(",");

/*Range for slider*/
var dataTime = d3.range(0, 4).map(function(d) {
    return new Date(2022, 0+d);
});

/*Slider*/
var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .marks(dataTime)
    .width(300)
    .tickFormat(d3.timeFormat('%B'))
    .tickValues(dataTime)
    .default(new Date(2022,0))
    .on('onchange', val => {
        d3.select('span#value-time').text(d3.timeFormat('%B')(val));
        updategraph(d3.timeFormat('%B')(val));
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(100,30)');

gTime.call(sliderTime);

d3.select('span#value-time').text(d3.timeFormat('%B')(sliderTime.value()));

/*Function to update graph when slider value changes*/
function updategraph(val){
    d3.csv("./data/"+val+".csv").then(function(data)
    {
        // sort data
        data.sort(function(b, a) {
            return b.streams - a.streams;
        });

        /*X-axis*/
        x.domain([15000000,d3.max(data, function (d){return +d.streams})]);
        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(6).tickFormat(d3.format(".2s")))
            .selectAll("text")
            .attr("font-size",20);

        /*Y-axis*/
        y.domain(data.map(function(d){return d.track_name;}))
        yAxis.call(d3.axisLeft(y))
            .selectAll("text")
            .attr("font-size",15)
            .call(wrapText, 225)

        /*Draw line*/
        var l = container_l.selectAll(".myline")
            .data(data)

            l.enter()
            .append('line')
            .attr("class","myline")
            .merge(l)
            .transition()
            .duration(1000)
                .attr("transform","translate(250,20)")
                .attr("x1", function(d) { return x(d.streams); })
                .attr("x2", x(15000000))
                .attr("y1", function(d) { return y(d.track_name); })
                .attr("y2", function(d) { return y(d.track_name); })
                .attr("stroke", "grey")

        /*Draw circles at the end of lollipop chart*/
        var c = container_l.selectAll("circle")
            .data(data)

            c.enter()
            .append("circle")
            .on('mouseover',function (event, d) {
                div.transition().duration(200).style("opacity", 1);
                div.html(function(b){return formatNum(d.streams)})
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .merge(c)
            .transition()
            .duration(1000)
                .attr("transform","translate(250,20)")
                .attr("cx",function(d){return x(d.streams);})
                .attr("cy",function(d){return y(d.track_name);})
                .attr("r",7.5)
                .style("stroke","black")
                .style("fill","#69b3a2")

        /*To wrap long y-axis tick text*/
        function wrapText(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    textContent = text.text(),
                    tempWord = addBreakSpace(textContent).split(/\s+/),
                    x = text.attr('x'),
                    y = text.attr('y'),
                    dy = parseFloat(text.attr('dy') || 0),
                    tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
                for (var i = 0; i < tempWord.length; i++) {
                    tempWord[i] = calHyphen(tempWord[i]);
                }
                textContent = tempWord.join(" ");
                var words = textContent.split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1, // ems
                    spanContent,
                    breakChars = ['/', '&', '-'];
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        spanContent = line.join(' ');
                        breakChars.forEach(function(char) {
                            // Remove spaces trailing breakChars that were added above
                            spanContent = spanContent.replace(char + ' ', char);
                        });
                        tspan.text(spanContent);
                        line = [word];
                        tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                    }
                }
                var emToPxRatio = parseInt(window.getComputedStyle(text._groups[0][0]).fontSize.slice(0,-2));
                text.attr("transform", "translate(-" + (marginL - 195) + ", -" + lineNumber/2 * lineHeight * emToPxRatio + ")");
                function calHyphen(word) {
                    tspan.text(word);
                    if (tspan.node().getComputedTextLength() > width) {
                        var chars = word.split('');
                        var asword = "";
                        for (var i = 0; i < chars.length; i++) {
                            asword += chars[i];
                            tspan.text(asword);
                            if (tspan.node().getComputedTextLength() > width) {
                                if (chars[i - 1] !== "-") {
                                    word = word.slice(0, i - 1) + "- " + calHyphen(word.slice(i - 1));
                                }
                                i = chars.length;
                            }
                        }
                    }
                    return word;
                }
            });

            function addBreakSpace(inputString) {
                var breakChars = ['/', '&', '-']
                breakChars.forEach(function(char) {
                    // Add a space after each break char for the function to use to determine line breaks
                    inputString = inputString.replace(char, char + ' ');
                });
                return inputString;
            }
        }

    })
}

/*Initial load of graph*/
updategraph(d3.timeFormat('%B')(sliderTime.value()));