var canvasWidth = 1000;
var canvasHeight = 500;
var marginH = 100;
var marginW = 200;
var marginL = 180;

var svg_t = d3.select("#test")
    .append("svg")
    .attr("width",canvasWidth)
    .attr("height",canvasHeight)
    .attr("transform","translate(100,0)");

var width = canvasWidth-marginW;
var height = canvasHeight-marginH;

var container_t = svg_t.append("g").attr("transform","translate(100,0)");

var x = d3.scaleLinear().range([0,width])
var y = d3.scaleBand().range([400,0])

var formatNum = d3.format(",");

d3.csv("./data/test_data.csv").then(function(data)
{
    // sort data
    data.sort(function(b, a) {
        return b.streams - a.streams;
    });

    x.domain([0,d3.max(data, function (d){return +d.streams})]);
    y.domain(data.map(function(d){return d.track_name;}))

    //X-axis
    container_t.append("g")
        .attr("transform", "translate(75, " + 400 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    //Y-axis
    var yAxis1 = container_t.append("g")
        .call(d3.axisLeft(y))
        .attr("transform","translate(75,0)")
        .selectAll(".tick text")
        .call(wrapText, 150)

    console.log(yAxis1.selectAll(".tick text"));

    container_t.selectAll("myline")
        .data(data)
        .join("line")
        .attr("transform","translate(75,20)")
        .attr("x1", function(d) { return x(d.streams); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.track_name); })
        .attr("y2", function(d) { return y(d.track_name); })
        .attr("stroke", "grey")

    container_t.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("transform","translate(75,20)")
        .attr("cx",function(d){return x(d.streams);})
        .attr("cy",function(d){return y(d.track_name);})
        .attr("r",7.5)
        .style("stroke","black")
        .style("fill","#92a8d1")
        .on('mouseover',function (event, d) {
            div.transition().duration(200).style("opacity", 1);
            div.html(function(b){return formatNum(d.streams)})
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 550) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

    function wrapText(text, width) {
        text.each(function() {
            //console.log(d3.select(this));
            //console.log(d3.select(this).text());
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
            text.attr("transform", "translate(-" + (marginL - 175) + ", -" + lineNumber/2 * lineHeight * emToPxRatio + ")");
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