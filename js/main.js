var BarChart = require('..');
var _ = require('underscore');

function randomItems(num) {
  return _.map(_.range(num), function(val) {
    return {name: '#' + val, value: _.random(99)};
  });
}

var bc = new BarChart({
  bar_colors: ['#00AB8E', '#33CCDD'],
  label_inside_colors: ['#FFF', '#333'],
  auto_scale: true,
  container: document.getElementById('chart-container')
});

function data() {
  bc.data([randomItems(6), randomItems(6)]);
}

data();

window.setInterval(data, 10000);
