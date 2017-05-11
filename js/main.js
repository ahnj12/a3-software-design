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
            // .xFormat(d3.format("d"))
            // .yFormat(d3.format('d'))
            .colorScale(d3.scaleOrdinal(d3.schemeCategory20))
            .toolTipStroke('blue')
            .strokeWidth('5')
            .transitionDuration(2000);

        chart.call(selection);

        console.log(chart.colorScale());


    });

});