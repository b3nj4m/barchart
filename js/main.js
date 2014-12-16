var BarChart = require('..');

var bc = new BarChart({
  bar_colors: ['#00AB8E', '#33CCDD'],
  label_inside_colors: ['#FFF', '#333'],
  auto_scale: true,
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
]]);

bc.render();
