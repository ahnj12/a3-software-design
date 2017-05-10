class TimeSeriesChart {
    constructor() {
        this._width = 200;
        this._height = 100;
        this._xScale = d3.scaleLinear();
        this._yScale = d3.scaleLinear();
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
                // .call(xAxis);

            let xAxisText = svgEnter.append('text')
                .attr('transform', `translate(${outerThis._margin.left + drawWidth / 2}, ${outerThis._margin.top + drawHeight + 40})`)
                .attr('class', 'axis-label')
                .text(outerThis._xTitle);


            let yAxisLabel = svgEnter.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${outerThis._margin.left}, ${outerThis._margin.top})`)
                // .call(yAxis);


            let yAxisText = svgEnter.append('text')
                .attr('transform', `translate(${outerThis._margin.left - 40}, ${outerThis._margin.top + drawHeight / 2}) rotate(-90)`)
                .attr('class', 'axis-label')
                .text(outerThis._yTitle);
        
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
}