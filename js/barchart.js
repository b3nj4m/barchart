//TODO warnings about bad height_scale + domain choices
//TODO should have pretty set of default colors for up to X datasets
//TODO hover states and click events
//TODO allow user to artificially override the extrema
//TODO allow as much as possible to be overriden with css
//TODO graceful failure when data is missing values or labels, etc.
//TODO tooltip showing full value
//TODO best way to implement tooltip without coupling to a particular library?

(function() {
  var isArray = function(obj) {
    return window.Object.prototype.toString.call(obj) === '[object Array]';
  };

  var log = function(message) {
    if (window.console && window.console.log) {
      window.console.log(message);
    }
  };

  var uniqueId = (function() {
    var current = 0;

    return function() {
      return current++;
    };
  }());

  var defineBarChart = function(d3) {
    var Chart = function(options) {
      if (options) {
        for (var i in options) {
          if (this[i] !== undefined)
            this[i] = options[i];
        }
      }

      if (d3.scale[this.height_scale_type] === undefined) {
        log('invalid height_scale_type "' + this.height_scale_type + '", using "' + Chart.prototype.height_scale_type + '" instead');
        this.height_scale_type = Chart.prototype.height_scale_type;
      }

      if (this.data === undefined || !isArray(this.data)) {
        log('invalid data. data should be an array');
        this.data = [this.data];
      }

      if (!isArray(this.data[0])) {
        this.data = [this.data];
      }

      this.make_accessors();

      if (this.data.length > 0) {
        if (isArray(this.data[0])) {
          this.num_datasets = this.data.length;
        }
        else {
          this.num_datasets = 1;
          this.data = [this.data];
        }
        this.dataset_size = d3.max(this.data, function(arr) { return arr.length; });
        this.num_records = this.num_datasets * this.dataset_size;

        // transform array of datasets into flat array with ordering like:
        // [dataset1_record1, dataset2_record1, ..., dataset1_record2, dataset2_record2, ...]
        var data = new Array(this.num_records);
        var idx;
        for (var record_num = 0; record_num < this.dataset_size; record_num++) {
          for (var dataset_num = 0; dataset_num < this.num_datasets; dataset_num++) {
            idx = record_num * this.num_datasets + dataset_num;
            data[idx] = this.data[dataset_num][record_num];
            data[idx].__id = uniqueId();
          }
        }

        this.data = data;

        var extrema = d3.extent(this.data, this.data_value_accessor);
        this.minimum = extrema[0];
        this.maximum = extrema[1];
      }
    };
  
    Chart.prototype.make_accessors = function() {
      var chart = this;
      chart.data_value_accessor = function(d) {
        if (typeof d !== 'undefined' && d !== null) {
          return d[chart.data_value_key];
        }
      };
      chart.label_top_accessor = function(d) {
        if (typeof d !== 'undefined' && d !== null) {
          return d[chart.label_top_key];
        }
      };
      chart.label_inside_accessor = function(d) {
        if (typeof d !== 'undefined' && d !== null) {
          return d[chart.label_inside_key];
        }
      };
      chart.x_scale_accessor = function(d, i) {
        return chart.x_scale(i);
      };
      chart.x_scale_px_accessor = function(d, i) {
        return chart.x_scale_accessor(d, i) + 'px';
      };
      chart.y_scale_accessor = function(d, i) {
        return chart.y_scale(chart.data_value_accessor(d));
      };
      chart.y_scale_px_accessor = function(d, i) {
        return chart.y_scale_accessor(d, i) + 'px';
      };
      chart.label_top_y_scale_accessor = function(d, i) {
        return chart.label_top_y_scale(chart.data_value_accessor(d), this);
      };
      chart.label_top_y_scale_px_accessor = function(d, i) {
        return chart.label_top_y_scale_accessor.apply(this, [d, i]) + 'px';
      };
      chart.height_scale_accessor = function(d, i) {
        return chart.height_scale(chart.data_value_accessor(d));
      };
      chart.height_scale_px_accessor = function(d, i) {
        return chart.height_scale_accessor(d, i) + 'px';
      };

      if (isArray(chart.bar_colors)) {
        chart.bar_color_accessor = function(d, i) {
          return chart.bar_colors[i % chart.num_datasets] || '#999';
        };
      }
      else {
        chart.bar_color_accessor = function(d, i) {
          return chart.bar_colors;
        };
      }

      if (isArray(chart.label_inside_colors)) {
        chart.label_inside_color_accessor = function(d, i) {
          return chart.label_inside_colors[i % chart.num_datasets] || '#FFF';
        };
      }
      else {
        chart.label_inside_color_accessor = function(d, i) {
          return chart.label_inside_colors;
        };
      }

      if (isArray(chart.label_top_colors)) {
        chart.label_top_color_accessor = function(d, i) {
          return chart.label_top_colors[i % chart.num_datasets] || '#FFF';
        };
      }
      else {
        chart.label_top_color_accessor = function(d, i) {
          return chart.label_top_colors;
        };
      }
    };
  
    Chart.prototype.data_id_accessor = function(d, i) {
      return d.__id;
    };
 
    Chart.prototype.animation_delay = function(d, i) {
      return i * 100;
    };
  
    Chart.prototype.container = null;
    Chart.prototype.has_rendered = false;
    Chart.prototype.is_animated = true;
    Chart.prototype.animation_duration = 400;
    Chart.prototype.auto_scale = false;
    Chart.prototype.height_scale_type = 'log';
    Chart.prototype.bar_colors = '#00AB8E';
    Chart.prototype.bar_spacing = 2;
    Chart.prototype.group_spacing = 8;
    Chart.prototype.chart_padding = 0;
    Chart.prototype.data = null;
    Chart.prototype.numDatasets = 0;
    Chart.prototype.data_value_key = 'value';
    Chart.prototype.height = 300;
    Chart.prototype.width = 700;
    Chart.prototype.label_top_colors = '#003D4C';
    Chart.prototype.label_inside_colors = '#FFF';
    Chart.prototype.label_inside_key = 'value';
    Chart.prototype.label_padding = 3;
    Chart.prototype.label_size = 16;
    Chart.prototype.label_top_key = 'name';
  
    //TODO break this down into separate functions so you can override individual calculations
    Chart.prototype.compute_boundaries = function() {
      var chart = this;

      if (this.auto_scale) {
        this.width = this.container_elem.scrollWidth || this.width;
      }
  
      if (this.data.length === 0) {
        return;
      }

      this.min_bar_size = this.label_size + this.label_padding * 2;
      this.max_bar_size = Math.max(this.min_bar_size, this.height - this.chart_padding - this.label_size - this.label_padding * 2);

      this.bar_width = Math.floor((this.width - this.chart_padding * 2 - (this.num_records - 1) * this.bar_spacing - (this.dataset_size - 1) * this.group_spacing) / this.num_records);
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
        var group_num = Math.floor(idx / this.num_datasets);
        var dataset_num = idx % this.num_datasets;
        return group_x_scale(group_num) + bar_x_scale(dataset_num);
      };
  
      var baseline = this.height - this.chart_padding;
      this.y_scale = function(val) {
        return baseline - chart.height_scale(val);
      };
  
      this.label_top_y_scale = function(val, ctx) {
        var y = chart.y_scale(val) - chart.label_padding;
        if (ctx !== undefined && ctx.scrollHeight) {
          y = y - ctx.scrollHeight;
        }
        return y;
      };
    };
  
    Chart.prototype.render = function() {
      if (!this.has_rendered) {
        if (this.container === undefined) {
          this.container = document.body;
        }
  
        this.$container = d3.select(this.container).append('div').style('position', 'relative');
        this.container_elem = this.$container[0][0];
  
        if (this.data === undefined || this.data === null || this.data.length == 0) {
          return;
        }
  
        this.compute_boundaries();
  
        if (!this.is_animated) {
          this.animation_delay = 0;
          this.animation_duration = 0;
        }
  
        this.svg = this.$container.append('svg')
          .attr('height', this.height)
          .attr('width', this.width);
        this.$container
          .style('height', this.height + 'px')
          .style('width', this.width + 'px');
      }
  
      var bars = this.svg.selectAll('rect').data(this.data, this.data_id_accessor);
      var labels_top = this.$container.selectAll('.label-top').data(this.data, this.data_id_accessor);
      var labels_inside = this.$container.selectAll('.label-inside').data(this.data, this.data_id_accessor);
  
      var bars_enter = bars.enter();
      var chart = this;
      if (!bars_enter.empty()) {
        bars_enter = bars_enter.append('rect')
          .attr('x', this.x_scale_accessor)
          .attr('y', this.y_scale(this.minimum))
          .attr('width', this.bar_width)
          .attr('height', this.height_scale(this.minimum))
          .style('fill', this.bar_color_accessor);
  
        labels_top.enter().append('div')
          .classed('label-top', true)
          .text(this.label_top_accessor)
          .style('position', 'absolute')
          .style('color', this.label_top_color_accessor)
          .style('top', function(d, i) {
            return chart.label_top_y_scale(chart.minimum, this) + 'px';
          })
          .style('left', this.x_scale_px_accessor)
          .style('width', this.bar_width + 'px')
          .style('line-height', this.label_size + 'px')
          .style('text-align', 'center');
  
        labels_inside.enter().append('div')
          .classed('label-inside', true)
          .style('position', 'absolute')
          .style('overflow', 'hidden')
          .style('top', this.y_scale_px_accessor)
          .style('left', this.x_scale_px_accessor)
          .style('width', this.bar_width + 'px')
          .style('height', this.height_scale_px_accessor)
        .append('div')
          .data(this.data, this.data_id_accessor)
          .style('position', 'absolute')
          .style('color', this.label_inside_color_accessor)
          .style('bottom', '0')
          .style('left', '0')
          .style('text-align', 'center')
          .style('width', '100%')
          .text(this.minimum)
      }
      
      bars.transition()
        .delay(this.animation_delay)
        .duration(this.animation_duration)
        .attr('height', this.height_scale_px_accessor)
        .attr('y', this.y_scale_accessor);
  
      labels_top.transition()
        .delay(this.animation_delay)
        .duration(this.animation_duration)
        .style('top', this.label_top_y_scale_px_accessor);
  
      //if we have positive numbers less than 5 digits in length, animate them!
      if (this.minimum >= 1 && this.maximum < 10000 && this.maximum - this.minimum > 10) {
        labels_inside.selectAll('div')
          .data(this.data, this.data_id_accessor)
          .transition()
          .tween('label_inside_text', function(d) {
            //using height_scale to ensure that the values shown are consistent with the exact scale of the graph
            var tick_scale = d3.scale.linear()
              .domain([0, 1])
              .range([chart.min_bar_size, chart.height_scale(chart.data_value_accessor(d))]);

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
          .data(this.data, this.data_id_accessor)
          .html(function(d, i) {
            return chart.prettify_number(chart.data_value_accessor(d));
          });
      }
  
      this.has_rendered = true;
    };
  
    Chart.prototype.LN10x2 = Math.LN10 * 2;
    //TODO ability to parameterize based on domain of dataset?
    Chart.prototype.prettify_number = function(num) {
      var suffixes = ' kMBT';
      var abs = Math.abs(num);
      var mag;
      if (abs < 1) {
        mag = Math.floor(Math.log(abs) / Math.LN10);
      }
      else {
        //average with magnitude of num + 1 to correct for floating-point error
        mag = Math.floor((Math.log(abs) + Math.log(abs + 1)) / (Chart.prototype.LN10x2));
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
  
    return Chart;
  };
  if (typeof define === 'function' && define.amd) {
    define('barchart', ['d3'], defineBarChart);
  }
  else if (typeof exports === 'object' && typeof module !== 'undefined' && typeof require === 'function') {
    module.exports = defineBarChart(require('d3'));
  }
  else {
    window.BarChart = defineBarChart(window.d3);
  }
}());
