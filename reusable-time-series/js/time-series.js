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
                return [outerThis._xValue(d, i), outerThis._yValue(d, i)];
            });
            console.log(data[0]);


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
                
        
            // Create an ordinal color scale for coloring lines
            let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            // Define xAxis and yAxis functions
            let xAxis = d3.axisBottom().tickFormat(this._xFormat);
            let yAxis = d3.axisLeft().tickFormat(this._yFormat);

            // Calculate x and y scales
            let xExtent = d3.extent(data, d => d[0]);
            outerThis._xScale.domain([xExtent[0], xExtent[1]]).rangeRound([0, drawWidth]);

            let yExtent = d3.extent(data, d => d[1]);
            outerThis._yScale.domain([yExtent[0], yExtent[1]]).rangeRound([drawHeight, 0]);

            // colorScale.domain()

            xAxis.scale(outerThis._xScale);
            yAxis.scale(outerThis._yScale);

            xAxisLabel.transition().duration(1000).call(xAxis);
            yAxisLabel.transition().duration(1000).call(yAxis);

            // // Update axes
            // xAxis.scale(xScale);
            // yAxis.scale(yScale);
            // ele.select('.axis.x').transition().duration(1000).call(xAxis);
            // ele.select('.axis.y').transition().duration(1000).call(yAxis);

        })
    }

    width(value) {
        if (value) {
            this._width = value;
        }
        return this;
    }

    height(value) {
        if (value) {
            this._height = value;
        }
        return this;
    }

    x(_) {
        if (_) {
            this._xValue = _;
        }
        return this;
    }

    y(_) {
        if (_) {
            this._yValue = _;
        }
        return this;
    }
}