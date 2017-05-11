$(function() {
    // Variables to show
    var nestedData;
    var lineColor = 'blue';

    // Load data in using d3's csv function.
    d3.csv('data/un_co2_data.csv', function(error, data) {
        // Put data into generic terms
        var prepData = function() {

            nestedData = d3.nest()
                .key(function(d) {
                    return d.country_area;
                })
                .entries(data);
        };

        prepData();

        var draw = function() {
            // Prep data
            prepData();


            for (var i = 0; i < nestedData.length; i++)
            {
                $('#vis-container').append('<div id="vis' + i + '"></div>');
                var visDiv = '#vis' + i;
                var selection = d3.select(visDiv).datum(nestedData[i].values); // specify DOM and data all at once
                var myChart = new TimeSeriesChart().width(720).height(500)
                    .x(function (d) { return d.year; })
                    .y(function (d) { return d.value; })
                    .xTitle('Year')
                    .yTitle('CO2 emissions')
                    .lineColor(lineColor)
                    .strokeWidth(i + 1);
                myChart.call(selection)
            }


        };

        // Call draw function
        draw();

        // Set change event to the select menu
        // $('select').on('change', function(d) {
        //     lineColor = $(this).val();
        //     draw();
        // });


    });
});