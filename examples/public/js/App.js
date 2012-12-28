requirejs.config({
  paths: {
    'ember': 'lib/ember',
    'handlebars': 'lib/handlebars',
    'bootstrap': 'lib/bootstrap',
    'jquery': 'lib/jquery',
    'hbs': 'lib/hbs',
    'd3': 'lib/d3',
    'barchart': 'lib/barchart',
    'crossfilter': 'lib/crossfilter',

    'template': '../template'
  },
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'ember': {
      deps: ['jquery', 'handlebars'],
      exports: 'Ember'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'd3': {
      exports: 'd3'
    },
    'crossfilter': {
      exports: 'crossfilter'
    }
  },
  hbs: {
    templateExtension: 'hbs'
  }
});

requirejs([
  'ember',
  'bootstrap',
  'Router',
  'ApplicationController',
  'ApplicationView',
  'IndexController',
  'IndexView'
],
function(Ember, Bootstrap, Router, ApplicationController, ApplicationView, IndexController, IndexView) {
  var App = window.App = Ember.Application.create({
    ApplicationController: ApplicationController,
    ApplicationView: ApplicationView,

    IndexController: IndexController,
    IndexView: IndexView,

    Router: Router
  });
  return App;
});
