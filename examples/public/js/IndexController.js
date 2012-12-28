define([
  'ember',
  'LoadData'
],
function(Ember, LoadData) {
  var IndexController = Ember.ObjectController.extend(LoadData, {
    dataUrl: '/json/chart_data.json',
    dataKey: 'data'
  });
  return IndexController;
});
