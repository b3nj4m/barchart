var BarChart = require('..');
var _ = require('underscore');

function randomItems(num) {
  return _.map(_.range(num), function(val) {
    return {name: '#' + val, value: _.random(99)};
  });
}

var bc = new BarChart({
  barColors: ['#00AB8E', '#33CCDD'],
  labelInside_colors: ['#FFF', '#333'],
  autoScale: true,
  container: document.getElementById('chart-container')
});

function data() {
  var numItems = _.random(4, 8);
  bc.data([randomItems(numItems), randomItems(numItems)]);
}

data();

window.setInterval(data, 10000);
