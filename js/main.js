$(function () {
    'use strict';


    d3.csv('data/sp500.csv', function (error, data) {

        let selection = d3.select("#viz").datum(data);
        // ES6 class reusable chart variation
        let chart = new TimeSeriesChart()
            .width(960)
            .height(500)
            .x(d => +d.date.slice(4))
            .y(d => +d.price)
            .xTitle("Years")
            .yTitle("Prices")
            .xFormat(d3.format("d"))
            .yFormat(d3.format('d'));

        chart.call(selection);

        console.log(chart.width());
        // Mike Bostock's closure reusable chart proposal
        // selection.call(chart.call);


    });

});