## barchart

### Usage

```javascript
var BarChart = require('barchart');

var bc = new BarChart({
  barColors: ['#00AB8E', '#33CCDD'],
  labelInsideColors: ['#FFF', '#333'],
  autoScale: true,
  container: document.getElementById('chart-container')
});

bc.data([[
    {"name": "#1", "value": 12},
    {"name": "#2", "value": 20},
    {"name": "#3", "value": 30},
    {"name": "#4", "value": 70},
    {"name": "#5", "value": 63},
    {"name": "#6", "value": 35}
  ],[
    {"name": "#1'", "value": 2},
    {"name": "#2'", "value": 10},
    {"name": "#3'", "value": 3},
    {"name": "#4'", "value": 7},
    {"name": "#5'", "value": 6},
    {"name": "#6'", "value": 3}
  ]]
);
```

[demo](https://b3nj4m.github.io/barchart)

### Config Options

Set config options when constructing chart object:

```javascript
var bc = new BarChart({
  //opts
});
```

#### container

DOM element to render the chart into (default: `document.body`).

#### isAnimated

Set to false if you don't want animation (default: `true`).

#### animationDuration

Animation duration in ms (default: `400`).

#### autoScale

Whether or not BarChart should scale to the width of the container (default: `false`).

#### heightScaleType

Which of d3's scale types to use (default: `'linear'`).

#### barColors

Color(s) to fill the bars with (also accepts an array for multi-dataset support) (default: `#00AB8E`).

#### barSpacing

Distance between each bar in pixels (default: `20`).

#### chartPadding

Padding around the outer edges of the chart in pixels (default: `10`).

#### dataValueKey

The key to use when looking up a value on an item in the data array (default: `'value``).

#### height

Height of the chart in pixels (default: `300`).

#### width

Width of the chart if not using `autoScale` (default: `700`).

#### labelTopColors

Text color of the top labels (also accepts an array for multi-dataset support) (default: `#003D4C`).

#### labelInsideColors

Text color of the labels inside the bars (also accepts an array for multi-dataset support) (default: `#FFF`).

#### labelInsideKey

Should usually be the same as the `dataValueKey` (default: `dataValueKey`).

#### labelPadding

Padding in pixels around each label (default: `3`).

#### labelSize

font size of the label texts in pixels (default: `16`).

#### labelTopKey

The key to use when looking up the top label on an item in the data array (default: `'name'`).

