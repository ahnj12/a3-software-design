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

        // Graph margin settings
        this._margin = {
            top: 10,
            right: 10,
            bottom: 150,
            left: 60
        };
    }

    // render chart here
    call(selection) {
        let outerThis = this;

        // Graph width and height - accounting for margins
        let drawWidth = outerThis._width - outerThis._margin.left - outerThis._margin.right;
        let drawHeight = outerThis._height - outerThis._margin.top - outerThis._margin.bottom;

        selection.each(function(data, index) {
            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function(d, i) {
                return {
                    x: outerThis._xValue(d, i),
                    y: outerThis._yValue(d, i),
                    id: i
                };
            });
            // console.log(data);

            let ele = d3.select(this);
            let svg = ele.selectAll("svg").data([data]);

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


            // Create an ordinal color scale for coloring lines
            let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Define xAxis and yAxis functions
            let xAxis = d3.axisBottom().tickFormat(outerThis._xFormat);
            let yAxis = d3.axisLeft().tickFormat(outerThis._yFormat);

            // Calculate x and y scales
            let xExtent = d3.extent(data, d => d['x']);
            outerThis._xScale.domain([xExtent[0], xExtent[1]]).rangeRound([0, drawWidth]);

            let yExtent = d3.extent(data, d => d['y']);
            outerThis._yScale.domain([yExtent[0], yExtent[1]]).rangeRound([drawHeight, 0]);

            // colorScale.domain()

            xAxis.scale(outerThis._xScale);
            yAxis.scale(outerThis._yScale);

            xAxisLabel.transition().duration(1000).call(xAxis);
            yAxisLabel.transition().duration(1000).call(yAxis);

            // Define a line function that will return a `path` element based on data
            // hint: https://bl.ocks.org/mbostock/3883245
            let line = d3.line()
                .x(d => outerThis._xScale(d['x']))
                .y(d => outerThis._yScale(d['y']));

            // console.log(outerThis._xScale(2010));
            // console.log(outerThis._yScale(1517.68));

            let prices = g.selectAll('.prices').data([data,]);

            prices.enter()
                .append('path')
                .attr('class', 'countries')
                .attr("d", d => line(d))
                .attr('fill', 'none')
                .attr('stroke-width', '1.5')
                .attr('stroke', 'red')
                .attr('stroke-dasharray', function(d) {
                    let length = d3.select(this).node().getTotalLength();
                    return `${length} ${length}`;
                })
                .attr('stroke-dashoffset', function(d) {
                    let length = d3.select(this).node().getTotalLength();
                    return `${length}`;
                })
                .transition()
                .duration(2500)
                .attr('stroke-dashoffset', 0);


            function drawHovers(year) {
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
                let circles = g.selectAll('circle').data(joinable_data);
                // Handle entering elements (see README.md)
                circles.enter()
                    .append('circle')
                    .attr('r', '15px')
                    .merge(circles)
                    .attr("cx", outerThis._xScale(year))
                    .attr('cy', obj => outerThis._yScale(obj.y))
                    .attr('stroke', 'red')
                    .attr('fill', 'none')
                    .transition()
                    .duration(2500);
                circles.exit().remove();

                // Do a data-join (enter, update, exit) draw text
                let text = g.selectAll('.hover-text').data(joinable_data);

                text.enter()
                    .append('text')
                    .attr('class', 'hover-text')
                    .merge(text)
                    .attr('x', outerThis._xScale(year))
                    .attr('y', obj => outerThis._yScale(obj.y))
                    .text(obj => obj.y)

                text.exit().remove();
                
            }

            d3.select('.overlay').on('mousemove', function(e) {
                let mouse = d3.mouse(this);
                let year = outerThis._xScale.invert(mouse[0]);
                drawHovers(year);
            })

            // $('.overlay').on('mouseout', function(e) {
            //     let elements = ['circle', '.hover-text'];
            //     elements.forEach(element => d3.selectAll(element).remove());
            //     // d3.selectAll('circle').remove();
            // })



        })
    }

    _chain(key, value) {
        if (value == undefined) {
            return this[key];
        } else {
            this[key] = value;
            return this;
        }
    }

    width(value) {
        return this._chain('_width', value);
    }

    height(value) {
        return this._chain('_height', value);
    }

    x(_) {
        return this._chain('_xValue', _);
    }

    y(_) {
        return this._chain('_yValue', _);
    }

    xTitle(title) {
        return this._chain('_xTitle', title);
    }

    yTitle(title) {
        return this._chain('_yTitle', title);
    }

    xFormat(format) {
        return this._chain('_xFormat', format);

    }

    yFormat(format) {
        return this._chain('_yFormat', format);
    }

}