var BarChart = require('..');
var _ = require('underscore');

function randomItems(num) {
  return _.map(_.range(num), function(val) {
    return {id: _.uniqueId(), name: '#' + val, value: _.random(99)};
  });
}

window.chart = new BarChart({
  barColors: ['#00AB8E', '#33CCDD'],
  labelInsideColors: ['#FFF', '#333'],
  dataIdKey: 'id',
  autoScale: true,
  container: document.getElementById('chart-container')
});

function data() {
  var numItems = _.random(4, 8);
  //var numItems = 6;
  window.randomData = [randomItems(numItems), randomItems(numItems)];
  chart.data(window.randomData);
}

data();

//window.setInterval(data, 10000);
