var BarChart = require('..');
var _ = require('underscore');

function randomItems(num) {
  return _.map(_.range(num), function(val) {
    return {name: '#' + val, value: _.random(99)};
  });
}

var chart = new BarChart({
  autoScale: true,
  minimum: 0,
  maximum: 100,
  container: document.getElementById('chart-container')
});

var numItems = 6;

function data() {
  chart.data([randomItems(numItems), randomItems(numItems)]);
}

data();

window.setInterval(data, 10000);
