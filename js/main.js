$(function () {
    'use strict';
    d3.csv('data/sp500.csv', function (error, data) {

        let selection = d3.select("#vis").datum(data);
        // ES6 class reusable chart variation
        let chart = new TimeSeriesChart()
            .width(500)
            .height(500)
            .call(selection)
        // Mike Bostock's closure reusable chart proposal
        // selection.call(chart.call);
    });

});