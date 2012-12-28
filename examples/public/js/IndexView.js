define([
  'ember',
  'ChartView',
  'hbs!template/index',
  'hbs!template/listItem'
],
function(Ember, ChartView, indexTemplate, listItemTemplate) {
  var IndexView = Ember.View.extend({
    template: indexTemplate,

    chartView1: ChartView.extend({
      contentBinding: 'App.router.indexController.content.chart1',
      classNames: ['span6'],
      chart_options: {
        auto_scale: true,
        label_top_key: 'name'
      }
    }),
    chartView2: ChartView.extend({
      contentBinding: 'App.router.indexController.content.chart2',
      classNames: ['span6'],
      chart_options: {
        auto_scale: true,
        label_top_key: 'name',
        bar_color: 'whitesmoke',
        label_inside_color: 'pink'
      }
    }),
    chartView3: ChartView.extend({
      contentBinding: 'App.router.indexController.content.chart3',
      classNames: ['span6'],
      chart_options: {
        auto_scale: true,
        label_top_key: 'name',
        bar_color: 'aquamarine',
        label_inside_color: 'dimgray'
      }
    }),
    chartView4: ChartView.extend({
      contentBinding: 'App.router.indexController.content.chart4',
      classNames: ['span6'],
      chart_options: {
        auto_scale: true,
        label_top_key: 'name',
        bar_color: 'tomato',
        label_inside_color: 'palegreen'
      }
    })
  });

  return IndexView;
});
