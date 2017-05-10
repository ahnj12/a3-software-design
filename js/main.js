$(function () {
    'use strict';

    // Graph margin settings
    var margin = {
        top: 10,
        right: 10,
        bottom: 150,
        left: 60
    };

    // SVG width and height
    var width = 960;
    var height = 500;

    // Graph width and height - accounting for margins
    var drawWidth = width - margin.left - margin.right;
    var drawHeight = height - margin.top - margin.bottom;

    /************************************** Create chart wrappers ***************************************/
    // Create a variable `svg` in which you store a selection of the element with id `viz`
    // Set the width and height to your `width` and `height` variables
    let svg = d3.select('#viz')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Append a `g` element to your svg in which you'll draw your bars. Store the element in a variable called `g`, and
    // Transform the g using `margin.left` and `margin.top`
    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    let xAxisLabel = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top + drawHeight})`)
        .attr('class', 'axis')
        // .call(xAxis);

    let xAxisText = svg.append('text')
        .attr('transform', `translate(${margin.left + drawWidth / 2}, ${margin.top + drawHeight + 40})`)
        .attr('class', 'axis-label')
        .text('X AXIS TEST');


    let yAxisLabel = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        // .call(yAxis);


    // Using the same pattern as your x-axis, append a text element to label your y axis
    // Set its class to 'axis-label', and set the text to "Count"
    let yAxisText = svg.append('text')
        .attr('transform', `translate(${margin.left - 40}, ${margin.top + drawHeight / 2}) rotate(-90)`)
        .attr('class', 'axis-label')
        .text('Y AXIS TEXT');

    d3.csv('data/sp500.csv', function (error, data) {

        let selection = d3.select("#viz").datum(data);
        // ES6 class reusable chart variation
        let chart = new TimeSeriesChart()
            .width(500)
            .height(500)
            .call(selection)
        // Mike Bostock's closure reusable chart proposal
        // selection.call(chart.call);


    });

});