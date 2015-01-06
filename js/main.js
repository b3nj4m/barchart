var BarChart = require('..');
var _ = require('underscore');

function randomItems(num) {
  return _.map(_.range(num), function(val) {
    return {name: '#' + val, value: _.random(99)};
  });
}

var bc = new BarChart({
  barColors: ['#00AB8E', '#33CCDD'],
  labelInsideColors: ['#FFF', '#333'],
  autoScale: true,
  container: document.getElementById('chart-container')
});

function data() {
  //var numItems = _.random(4, 8);
  var numItems = 6;
  bc.data([randomItems(numItems), randomItems(numItems)]);
}

data();

window.setInterval(data, 10000);
