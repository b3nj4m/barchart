module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'public/js/*.js']
    },
    jshint: {
      options: {
        browser: true
      }
    },
    jasmine: {
      amd: true,
      specs: 'test/spec/**/*.js',
      helpers: [
        'public-build/js/lib/require.js',
        'public-build/js/App.js'
      ]
    },
    requirejs: {
      appDir: "public",
      baseUrl: "js/",
      dir: "public-build",
      optimizeCss: "standard",
      optimize: "none",
      inlineText: true,
      removeCombined: true,
      keepBuildDir: true,
      pragmasOnSave: {
          excludeAfterBuild: !0
      },
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
      },

      locale: "en_us",
      modules: [{
          name: "App"
      }]
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  //grunt.loadNpmTasks('grunt-sample');

  // Default task.
  grunt.registerTask('default', 'lint requirejs jasmine');
  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-requirejs');

};
