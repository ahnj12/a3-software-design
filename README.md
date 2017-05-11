# Re-usable time series D3 Chart

By Luis Naranjo


## Purpose

### Time series charts are cool

Time series charts are one of the most simple and straightforward ways to visualize data. This is likely because a sense of time is very intuitive to us because we are constantly living in it. A time series makes it easy for a user of a data visualization to see the history of a particular variable by tracking the slope and the change in slope of a line in a chart over time.

I wanted to build a reusable D3 chart component for this reason, so that people can build simple and configurable time series charts without needing to understand the nitty gritty details of D3.

### ES6 classes are cool

The [pattern proposed by Mike Bostock](https://bost.ocks.org/mike/chart/) relies heavily on closures. Closures are cool and all, but having recently learned about ES6 classes, I wondered how a re-usable chart might be implemented using classes instead of closures. Intuitively, it seemed obvious to me that classes were a more natural tool to use than closures, since the closure version of the re-usable chart essentially involved a hacky constructor, with hacky fields, and hacky instance methods. Why not just use a class instead? After all, this is exactly the reason why they were added to Javascript.

Initially, my theory for why closures were being widely used instead of ES6 classes was that since ES6 classes were introduced very recently, and the reusable chart pattern was introduced in 2012, the D3 community just found it easier to stick to the status quo. Curious as to whether there were any other reasons, I set forth implementing my reusable time series chart as a class instead of a closure. I thought of this homework assignment as a quasi personal research experiment.

In short, I concluded that using ES6 classes for building re-usable D3 charts, although conceptually appealing, is not as great as it sounds. Closures are definitely a more usable mechanism for implementing reusable charts because when you create a function from a closure, it is executable itself and stores state. This makes them a lot more convenient to integrate with d3 and they are more able to be plug-and-play when working with other d3 code. If I had to do it again, I would just use a closure.

## Getting started

### Import the re-usable time series chart class
The re-usable time series chart (TimeSeriesChart) exists in the time-series.js file.

In order to use this class, you first need to include the time-series.js file in your html file **before** you include your main js file which will utilize the re-usable time series chart.

For example, your html file might look something like this.
```
<body>
  <!-- Your content goes here -->
  <script src="reusable-time-series/js/time-series.js"></script>
  <script src="js/main.js"></script>
</body>
```

*Note: Even though this chart is implemented using ES6 classes instead of closures, you still can't import this chart class with the ES6 import/export syntax unless you set up a transpiler, since not all of ES6 features are supported natively by browsers at the time of writing. This is why I suggest you "import" the class by including the js files in HTML.*

### Using the chart class

Conceptually, the usage pattern for this re-usable chart is to tell it 1) what your data is, and 2) where in the DOM you want the chart to get rendered. Given those two things, the chart has everything that it needs to render itself.

However, instead of specifying those 2 things separately, you specify them both at the same time using a d3 selection object, which binds data to DOM elements. This gives the chart and the chart user more flexibility. For example, this means that you can use this chart class to easily create a single time series chart, or even multiple time series charts for nested data structures with little effort.

Mike Bostock talks about all of this in his article "Towards Reusable Charts". However, since this chart is implemented as a class instead of as a closure, the syntax that you need to use will be slightly different.

For example, here is how you would utilize a closure based chart like Mike Bostock's proposal

```
let selection = d3.select("#example").datum(data); // specify DOM and data all at once
let myChart = chart().width(720).height(80);
selection.call(myChart);
```

Here is how you would use this class based chart:
```
let selection = d3.select("#example").datum(data); // specify DOM and data all at once
let myChart = chart().width(720).height(80);
chart.call(selection)
```

The reason for this different is that the closure based charts return an executable function, and the class based charts return an instance, which is not executable directly. Instead, you have to execute a specific method on that class that knows how to do the rendering (the call method on the chart class).


### Configuration

There are a number of customizations that you can apply to your reusable time series charts to make them more suitable to your particular data set. They are all configured via method calls on the chart object. Each method call returns a copy of the instance as a convenience for the user, to support method chaining.

*Note*: When you pass in a value to a configuration method, that method will set the value internally in the instance's fields, and then return "this" to allow further chaining. If there is no value passed in to the configuration method, the method will just return the value currently being stored in the field for inspection, and therefore will not return "this", and will not support subsequent chaning calls.

#### .x(accessor_func)
This configuration method allows you to supply a accessor function that shows the chart how to access the x value in the objects you supply in the data.

**Default value:** function(datum) { return datum; }

#### .y(accessor_func)
This configuration method allows you to supply a accessor function that shows the chart how to access the y value in the objects you supply in the data.

**Default value:** function(datum) { return datum; }

#### .xScale(scale_func)
This configuration method allows you to supply a scale function to use for the x scale

**Default value:** d3.scaleLinear()

#### .yScale(scale_func)
This configuration method allows you to supply a scale function to use for the y scale

**Default value:** d3.scaleLinear()

#### .width(value)
This configuration method specifies the width of the chart

**Default value:** 960px

#### .height(value)
This configuration method specifies the height of the chart

**Default value:** 500px

#### .xTitle(value)
This configuration method specifies the x axis label text

**Default value:** 'X AXIS TITLE'

#### .yTitle(value)
This configuration method specifies the y axis label text

**Default value:** 'Y AXIS TITLE'

#### .xFormat(format)
This method allows you to specify the tick format for the x axis

**Default value:** d3.format("d")

#### .yFormat(format)
This method allows you to specify the tick format for the y axis

**Default value:** d3.format('.2s')

#### .lineColor(value)
This method allows you to specify the color of the time series line

**Default value:** 'blue'

#### .toolTipStroke(value)
This method allows you to specify the stroke color of the tool tip on the line

**Default value:** 'red'

#### .strokeWidth(value)
This method allows you to specify the pixel stroke width for the line

**Default value:** '1.5'

#### .transitionDuration(value)
This method allows you to specify the duration of the transition for the appearance of the line on the graph
**Default value:** 1.5













