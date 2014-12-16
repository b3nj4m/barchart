//TODO unit tests
//TODO trend lines
//TODO warnings about bad height_scale + domain choices
//TODO should have pretty set of default colors for up to X datasets
//TODO hover states and click events
//TODO allow user to artificially override the extrema
//TODO allow as much as possible to be overriden with css
//TODO graceful failure when data is missing values or labels, etc.
//TODO tooltip showing full value
//TODO best way to implement tooltip without coupling to a particular library?

(function() {
  function defineBarChart(d3, _) {
    function px(fn) {
      return function() {
        return fn.apply(this, arguments) + 'px';
      };
    }

    function byIndex(fn) {
      if (_.isFunction(fn)) {
        return function(d, i) {
          return fn.call(this, i);
        };
      }
      else if (_.isArray(fn)) {
        return function(d, i) {
          return fn[i];
        };
      }
      else {
        return _.constant(fn);
      }
    }

    function byDatasetIndex(fn, num_datasets) {
      var idx = byIndex(fn);
      return function(d, i) {
        return idx(d, i % num_datasets);
      };
    }

    function BarChart(options) {
      if (options) {
        _.extend(this, options);
      }
    };

    BarChart.prototype.data = function(data) {
      if (!_.isArray(data)) {
        console.warn('Data should be an array.');
        data = [data];
      }

      if (!_.isArray(data[0])) {
        data = [data];
      }

      this.num_datasets = data.length;
      this.dataset_size = d3.max(data, function(arr) { return arr.length; });

      data = _.flatten(_.zip.apply(_, data));

      var chart = this;

      this.values = _.map(data, function(point) {
        return _.isNumber(point) ? point : point[chart.data_value_key];
      });

      this.labels_top = _.map(data, function(point) {
        return _.isNumber(point) ? null : point[chart.label_top_key];
      });

      this.labels_inside = _.map(data, function(point) {
        return _.isNumber(point) ? null : point[chart.label_inside_key];
      });

      this.ids = _.map(this.values, _.uniqueId);

      var extrema = d3.extent(this.values);
      this.minimum = extrema[0];
      this.maximum = extrema[1];

      this.render();
    };

    BarChart.prototype.palette = function(size, seed) {
      seed = seed || d3.rgb(100, 100, 150);
      var result = new Array(size);
      var hsl;
      result[0] = seed;

      for (var i = 1; i < size; i++) {
        hsl = d3.hsl(result[i - 1]);
        hsl.h = (hsl.h + 30) % 361;
        result[i] = hsl.rgb();
      }

      return _.map(result, function(rgb) {
        return rgb.toString();
      });
    };
  
    BarChart.prototype.animation_delay = function(d, i) {
      return i * 100;
    };
  
    BarChart.prototype.container = null;
    BarChart.prototype.has_rendered = false;
    BarChart.prototype.is_animated = true;
    BarChart.prototype.animation_duration = 400;
    BarChart.prototype.auto_scale = false;
    BarChart.prototype.height_scale_type = 'log';
    BarChart.prototype.bar_colors = '#00AB8E';
    BarChart.prototype.bar_spacing = 2;
    BarChart.prototype.group_spacing = 8;
    BarChart.prototype.chart_padding = 0;
    BarChart.prototype.numDatasets = 0;
    BarChart.prototype.data_value_key = 'value';
    BarChart.prototype.height = 300;
    BarChart.prototype.width = 700;
    BarChart.prototype.label_top_colors = '#003D4C';
    BarChart.prototype.label_inside_colors = '#FFF';
    BarChart.prototype.label_inside_key = 'value';
    BarChart.prototype.label_padding = 3;
    BarChart.prototype.label_size = 16;
    BarChart.prototype.label_top_key = 'name';
  
    //TODO break this down into separate functions so you can override individual calculations
    BarChart.prototype.compute_boundaries = function() {
      var chart = this;

      if (this.auto_scale) {
        this.width = this.container_elem.scrollWidth || this.width;
      }
  
      if (this.values.length === 0) {
        return;
      }

      this.min_bar_size = this.label_size + this.label_padding * 2;
      this.max_bar_size = Math.max(this.min_bar_size, this.height - this.chart_padding - this.label_size - this.label_padding * 2);

      this.bar_width = Math.floor((this.width - this.chart_padding * 2 - (this.values.length - 1) * this.bar_spacing - (this.dataset_size - 1) * this.group_spacing) / this.values.length);
      this.label_width = this.bar_width - this.label_padding * 2;
  
      this.height_scale = d3.scale[this.height_scale_type]()
        .domain([this.minimum, this.maximum])
        .range([this.min_bar_size, this.max_bar_size]);

      //record-group scale which maps group number to x-coord of left-most bar in the group
      var group_x_scale = d3.scale.linear()
        .domain([0, this.dataset_size - 1])
        .range([this.chart_padding, this.width - this.chart_padding - this.bar_width * this.num_datasets - (this.num_datasets - 1) * this.bar_spacing]);

      //record scale which maps idx within record-group to offset inside record group
      var bar_x_scale = d3.scale.linear()
        .domain([0, this.num_datasets - 1])
        .range([0, (this.num_datasets - 1) * (this.bar_width + this.bar_spacing)]);

      this.x_scale = function(idx) {
        var group_num = Math.floor(idx / chart.num_datasets);
        var dataset_num = idx % chart.num_datasets;
        return group_x_scale(group_num) + bar_x_scale(dataset_num);
      };
  
      var baseline = this.height - this.chart_padding;
      this.y_scale = function(val) {
        return baseline - chart.height_scale(val);
      };
  
      this.label_top_y_scale = function(val) {
        var y = chart.y_scale(val) - chart.label_padding;
        if (this.scrollHeight) {
          y = y - this.scrollHeight;
        }
        return y;
      };
    };
  
    BarChart.prototype.render = function() {
      if (this.container === undefined) {
        this.container = document.body;
      }

      this.$container = d3.select(this.container).append('div').style('position', 'relative');
      this.container_elem = this.$container[0][0];

      this.compute_boundaries();

      if (!this.is_animated) {
        this.animation_delay = 0;
        this.animation_duration = 0;
      }

      if (!this.svg) {
        this.svg = this.$container.append('svg')
          .attr('height', this.height)
          .attr('width', this.width);
      }

      if (!this.$container) {
        this.$container
          .style('height', this.height + 'px')
          .style('width', this.width + 'px');
      }

      //TODO no-data class, clear existing elements
      if (this.values === undefined || this.values.length == 0) {
        this.$container.classed('no-data', true);
        return;
      }
      else {
        this.$container.classed('no-data', false);
      }

      if (d3.scale[this.height_scale_type] === undefined) {
        console.warn('Invalid height_scale_type "' + this.height_scale_type + '", using "' + BarChart.prototype.height_scale_type + '" instead.');
        this.height_scale_type = BarChart.prototype.height_scale_type;
      }
  
      var bars = this.svg.selectAll('rect').data(this.values);
      var labels_top = this.$container.selectAll('.label-top').data(this.values);
      var labels_inside = this.$container.selectAll('.label-inside').data(this.values);
  
      var bars_enter = bars.enter();
      var chart = this;
      if (!bars_enter.empty()) {
        bars_enter = bars_enter.append('rect')
          .attr('x', byIndex(this.x_scale))
          .attr('y', this.y_scale(this.minimum))
          .attr('width', this.bar_width)
          .attr('height', this.height_scale(this.minimum))
          .style('fill', byDatasetIndex(this.bar_colors, this.num_datasets));
  
        labels_top.enter().append('div')
          .classed('label-top', true)
          .text(byIndex(this.labels_top))
          .style('position', 'absolute')
          .style('color', byDatasetIndex(this.label_top_colors, this.num_datasets))
          .style('top', this.label_top_y_scale(this.minimum, this) + 'px')
          .style('left', px(byIndex(this.x_scale)))
          .style('width', this.bar_width + 'px')
          .style('line-height', this.label_size + 'px')
          .style('text-align', 'center');
  
        labels_inside.enter().append('div')
          .classed('label-inside', true)
          .style('position', 'absolute')
          .style('overflow', 'hidden')
          .style('top', px(this.y_scale))
          .style('left', px(byIndex(this.x_scale)))
          .style('width', this.bar_width + 'px')
          .style('height', px(this.height_scale))
        .append('div')
          .data(this.values)
          .style('position', 'absolute')
          .style('color', byDatasetIndex(this.label_inside_colors, this.num_datasets))
          .style('bottom', '0')
          .style('left', '0')
          .style('text-align', 'center')
          .style('width', '100%')
          .text(this.minimum)
      }
      
      bars.transition()
        .delay(this.animation_delay)
        .duration(this.animation_duration)
        .attr('height', px(this.height_scale))
        .attr('y', this.y_scale);
  
      labels_top.transition()
        .delay(this.animation_delay)
        .duration(this.animation_duration)
        .style('top', px(this.label_top_y_scale));
  
      //if we have positive numbers less than 5 digits in length, animate them!
      if (this.minimum >= 1 && this.maximum < 10000 && this.maximum - this.minimum > 10) {
        labels_inside.selectAll('div')
          .data(this.values)
          .transition()
          .tween('label_inside_text', function(d) {
            //using height_scale to ensure that the values shown are consistent with the exact scale of the graph
            //TODO this isn't timed correctly
            var tick_scale = d3.scale.linear()
              .domain([0, 1])
              .range([chart.min_bar_size, chart.height_scale(d)]);

            return function(t) {
              this.textContent = Math.round(chart.height_scale.invert(tick_scale(t)));
            };
          })
          .delay(this.animation_delay)
          .duration(this.animation_duration);
      }
      //otherwise, pass them through the prettify_number routine
      else {
        labels_inside.selectAll('div')
          .data(this.values)
          .html(this.prettify_number);
      }
  
      this.has_rendered = true;
    };
  
    BarChart.prototype.LN10x2 = Math.LN10 * 2;
    //TODO ability to parameterize based on domain of dataset?
    BarChart.prototype.prettify_number = function(num) {
      var suffixes = ' kMBT';
      var abs = Math.abs(num);
      var mag;
      if (abs < 1) {
        mag = Math.floor(Math.log(abs) / Math.LN10);
      }
      else {
        //average with magnitude of num + 1 to correct for floating-point error
        mag = Math.floor((Math.log(abs) + Math.log(abs + 1)) / (BarChart.prototype.LN10x2));
      }
  
      if (mag >= 3) {
        var index = Math.floor(mag / 3);
        var suffix;
        if (suffixes.length > index) {
          suffix = suffixes.charAt(index);
        }
        else {
          suffix = '*10<sup>' + mag + '</sup>';
        }
        return (Math.round(num / Math.pow(10, mag - (mag % 3) - 1)) / 10.0) + suffix;
      }
      else if (mag <= -3) {
        return Math.round(num / Math.pow(10, mag)) + 'e' + mag;
      }
      else {
        return num.toString();
      }
    };
  
    return BarChart;
  };
  if (typeof define === 'function' && define.amd) {
    define('barchart', ['d3', 'underscore'], defineBarChart);
  }
  else if (typeof exports === 'object' && typeof module !== 'undefined' && typeof require === 'function') {
    module.exports = defineBarChart(require('d3'), require('underscore'));
  }
  else {
    BarChart = defineBarChart(d3, _);
  }
}());
