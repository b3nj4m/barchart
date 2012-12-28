define([
  'ember',
  'barchart',
  'hbs!template/chartView'
],
function(Ember, Chart, chartViewTemplate) {
  var ChartView = Ember.View.extend({
    content: null, //feed me data!
    template: chartViewTemplate,
    tagName: 'div',
    chart_options: {
      auto_scale: true
    },
    chart: null,

    didInsertElement: function() {
      this._super();
      var content = this.get('content');
      if (content)
        content = content.toArray();
      else
        content = null;
      var chart_options = this.get('chart_options');
      chart_options.container = this.get('element');
      chart_options.data = content;
      var chart = new Chart(chart_options);
      chart.render();
      this.set('chart', chart);
    },
    contentDidChange: function() {
      var chart = this.get('chart');
      var content = this.get('content');
      if (chart && content) {
        chart.data = content.toArray();
        chart.render();
      }
    }.observes('content')
  });
  return ChartView;
});
