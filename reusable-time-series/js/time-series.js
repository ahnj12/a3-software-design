class TimeSeriesChart {
    constructor() {
        this._width = 960;
        this._height = 500;
        this._xScale = d3.scaleLinear();
        this._yScale = d3.scaleLinear();
        this._xFormat = d3.format("d");
        this._yFormat = d3.format('.2s');
        this._xValue = d => d;
        this._yValue = d => d;
        this._xTitle = 'X AXIS TITLE';
        this._yTitle = 'Y AXIS TITLE';
        this._colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this._toolTipStroke = 'red';
        this._strokeWidth = '1.5';
        this._transitionDuration = 1000;

        // Graph margin settings
        this._margin = {
            top: 10,
            right: 10,
            bottom: 150,
            left: 60
        };
    }

    // handle the drawing of the tooltips
    drawHovers(data, g, year) {
        let outerThis = this;
        // Bisector function to get closest data point: note, this returns an *index* in your array
        let bisector = d3.bisector(function(d, x) {
                return +d.x - x;
            }).left;
        // let bisector = d3.bisector(d => d.x).left;

        let joinable_data = [];


        // Get hover data by using the bisector function to find the y value

        data.sort((a, b) => d3.ascending(+a.x, +b.x));
        let bisect = bisector(data, year);
        bisect = data[bisect];

        joinable_data.push(bisect);

        
        // // Do a data-join (enter, update, exit) to draw circles
        let circles = g.selectAll('circle').data(joinable_data, obj => obj.id);
        // Handle entering elements (see README.md)
        circles.enter()
            .append('circle')
            .attr('r', '15px')
            .merge(circles)
            .attr("cx", outerThis._xScale(year))
            .attr('cy', obj => outerThis._yScale(obj.y))
            .attr('stroke', outerThis._toolTipStroke)
            .attr('fill', 'none')
            .transition()
            .duration(2500);
        circles.exit().remove();

        // Do a data-join (enter, update, exit) draw text
        let text = g.selectAll('.hover-text').data(joinable_data, obj => obj.id);

        text.enter()
            .append('text')
            .attr('class', 'hover-text')
            .merge(text)
            .attr('x', outerThis._xScale(year))
            .attr('y', obj => outerThis._yScale(obj.y))
            .text(obj => obj.y)

        text.exit().remove();
    }




    // render chart here. pass in a d3 selection bound object
    call(selection) {
        // outerThis is needed to access the ES6 class's fields
        // since the selection.each callback function has it's own
        // scope and this
        let outerThis = this;

        // Graph width and height - accounting for margins
        let drawWidth = outerThis._width - outerThis._margin.left - outerThis._margin.right;
        let drawHeight = outerThis._height - outerThis._margin.top - outerThis._margin.bottom;

        // loop over each selection in the case of small multiples
        selection.each(function(data, index) {
            // Convert data to standard representation (configurable via accessors)
            data = data.map(function(d, i) {
                return {
                    x: outerThis._xValue(d, i),
                    y: outerThis._yValue(d, i),
                    id: i
                };
            });

            let ele = d3.select(this);
            let svg = ele.selectAll("svg").data([data], obj => obj.id);

            // Append static elements (i.e., only added once)
            let svgEnter = svg.enter()
                .append("svg")
                .attr('width', outerThis._width)
                .attr('height', outerThis._height);


            let g = svgEnter.append('g')
                .attr('transform', 'translate(' + outerThis._margin.left + ',' + outerThis._margin.top + ')')


            let xAxisLabel = svgEnter.append('g')
                .attr('transform', `translate(${outerThis._margin.left}, ${outerThis._margin.top + drawHeight})`)
                .attr('class', 'axis')

            let xAxisText = svgEnter.append('text')
                .attr('transform', `translate(${outerThis._margin.left + drawWidth / 2}, ${outerThis._margin.top + drawHeight + 40})`)
                .attr('class', 'axis-label')
                .text(outerThis._xTitle);


            let yAxisLabel = svgEnter.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${outerThis._margin.left}, ${outerThis._margin.top})`)

            let yAxisText = svgEnter.append('text')
                .attr('transform', `translate(${outerThis._margin.left - 40}, ${outerThis._margin.top + drawHeight / 2}) rotate(-90)`)
                .attr('class', 'axis-label')
                .text(outerThis._yTitle);

            // Apend an overlay rectangle to catch hover events
            let overlay = g.append('rect')
                .attr("class", "overlay")
                .attr('width', drawWidth)
                .attr('height', drawHeight)
                .attr('fill', 'none')
                .attr('pointer-events', 'all');

            // Define xAxis and yAxis functions
            let xAxis = d3.axisBottom().tickFormat(outerThis._xFormat);
            let yAxis = d3.axisLeft().tickFormat(outerThis._yFormat);

            // Calculate x and y scales
            let xExtent = d3.extent(data, d => d['x']);
            outerThis._xScale.domain([xExtent[0], xExtent[1]]).rangeRound([0, drawWidth]);

            let yExtent = d3.extent(data, d => d['y']);
            outerThis._yScale.domain([yExtent[0], yExtent[1]]).rangeRound([drawHeight, 0]);

            // set axis scales
            xAxis.scale(outerThis._xScale);
            yAxis.scale(outerThis._yScale);

            xAxisLabel.call(xAxis);
            yAxisLabel.call(yAxis);

            // Define a line function that will return a path element based on data
            let line = d3.line()
                .x(d => outerThis._xScale(d['x']))
                .y(d => outerThis._yScale(d['y']));


            let y_values = g.selectAll('.y_value').data([data,], obj => obj.id);

            y_values.enter()
                .append('path')
                .attr('class', 'y_value')
                .attr("d", d => line(d))
                .attr('fill', 'none')
                .attr('stroke-width', outerThis._strokeWidth)
                .attr('stroke', d => outerThis._colorScale(d.id))
                .attr('stroke-dasharray', function(d) {
                    let length = d3.select(this).node().getTotalLength();
                    return `${length} ${length}`;
                })
                .attr('stroke-dashoffset', function(d) {
                    let length = d3.select(this).node().getTotalLength();
                    return `${length}`;
                })
                .transition()
                .duration(outerThis._transitionDuration)
                .attr('stroke-dashoffset', 0);

            d3.select('.overlay').on('mousemove', function(e) {
                let mouse = d3.mouse(this);
                let year = outerThis._xScale.invert(mouse[0]);
                outerThis.drawHovers(data, g, year);
            })

            $('.overlay').on('mouseout', function(e) {
                let elements = ['circle', '.hover-text'];
                elements.forEach(element => d3.selectAll(element).remove());
            })



        })
    }

    // helper method to enable chaining in the getter/setter methods
    _chain(key, value) {
        if (value == undefined) {
            // if not value param passed in, simple return the value currently being stored
            return this[key];
        } else {
            // if a value is passed in, return this after setting the value to enable chaining
            this[key] = value;
            return this;
        }
    }

    // configure the width of the chart
    width(value) {
        return this._chain('_width', value);
    }

    // configure the height of the chart
    height(value) {
        return this._chain('_height', value);
    }

    // configure the accessor for the x values of the chart
    x(_) {
        return this._chain('_xValue', _);
    }

    // configure the accessor for the y values of the chart
    y(_) {
        return this._chain('_yValue', _);
    }

    // set the title of the x values label
    xTitle(title) {
        return this._chain('_xTitle', title);
    }

    // set the title of the y values label
    yTitle(title) {
        return this._chain('_yTitle', title);
    }

    // set the tick format for the x values
    xFormat(format) {
        return this._chain('_xFormat', format);

    }

    // set the tick format for the y values
    yFormat(format) {
        return this._chain('_yFormat', format);
    }

    // set the color scale for the line
    colorScale(scale) {
        return this._chain('_colorScale', scale);
    }

    // set the stroke color for the tool tip circle
    toolTipStroke(stroke) {
        return this._chain('_toolTipStroke', stroke);
    }

    // set the stroke width for the line
    strokeWidth(width) {
        return this._chain('_strokeWidth', width);
    }

    // set the duration for the line path transition
    transitionDuration(duration) {
        return this._chain('_transitionDuration', duration);
    }

}