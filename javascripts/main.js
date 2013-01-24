requirejs.config({
  shim: {
    'd3': {
      exports: 'd3'
    }
  }
});
define([
  'barchart'
],
function(BarChart) {
  var bc = new BarChart({
    data: [
      {"id": 0, "name": "item1", "value": 12},
      {"id": 1, "name": "item2", "value": 20},
      {"id": 2, "name": "item3", "value": 30},
      {"id": 3, "name": "item4", "value": 70},
      {"id": 4, "name": "item4", "value": 63},
      {"id": 5, "name": "item5", "value": 35}
    ],
    auto_scale: true,
    container: document.getElementById('chart-container')
  });
  bc.render();
  console.log(document.getElementById('chart-container'));
});
