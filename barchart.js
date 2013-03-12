//TODO tooltip showing full value
(function() {
  var defineBarChart = function(d3) {
    var Chart = function(options) {
      if (options) {
        for (var i in options) {
          if (this[i] !== undefined)
            this[i] = options[i];
        }
      }
  
      this.make_accessors();
    };
  
    Chart.prototype.make_accessors = function() {
      var chart = this;
      this.data_value_accessor = function(d) {
        if (d !== undefined && d !== null)
          return d[chart.data_value_key];
      };
      this.label_top_accessor = function(d) {
        if (d !== undefined && d !== null)
          return d[chart.label_top_key];
      };
      this.label_inside_accessor = function(d) {
        if (d !== undefined && d !== null)
          return d[chart.label_inside_key];
      };
      this.data_id_key_accessor = function(d) {
        if (d !== undefined && d !== null)
          return d[chart.data_id_key];
      };
      this.x_scale_accessor = function(d, i) {
        return chart.x_scale(i);
      };
      this.x_scale_px_accessor = function(d, i) {
        return chart.x_scale_accessor(d, i) + 'px';
      };
      this.y_scale_accessor = function(d, i) {
        return chart.y_scale(chart.data_value_accessor(d));
      };
      this.y_scale_px_accessor = function(d, i) {
        return chart.y_scale_accessor(d, i) + 'px';
      };
      this.label_top_y_scale_accessor = function(d, i) {
        return chart.label_top_y_scale(chart.data_value_accessor(d), this);
      };
      this.label_top_y_scale_px_accessor = function(d, i) {
        return chart.label_top_y_scale_accessor.apply(this, [d, i]) + 'px';
      };
      this.height_scale_accessor = function(d, i) {
        return chart.height_scale(chart.data_value_accessor(d));
      };
      this.height_scale_px_accessor = function(d, i) {
        return chart.height_scale_accessor(d, i) + 'px';
      };
    };
  
    Chart.prototype.data_value_accessor = function(d) {
      return d.value;
    };
  
    Chart.prototype.data_label_top_accessor = function(d) {
      return d.label_top;
    };
  
    Chart.prototype.data_label_inside_accessor = function(d) {
      return d.label_inside;
    };
  
    Chart.prototype.animation_delay = function(d, i) {
      return i * 100;
    };
  
    Chart.prototype.container = null;
    Chart.prototype.has_rendered = false;
    Chart.prototype.is_animated = true;
    Chart.prototype.animation_duration = 400;
    Chart.prototype.auto_scale = false;
    Chart.prototype.bar_color = '#00AB8E';
    Chart.prototype.bar_spacing = 20;
    Chart.prototype.chart_padding = 10;
    Chart.prototype.data = null;
    Chart.prototype.data_value_key = 'value';
    Chart.prototype.data_id_key = 'id';
    Chart.prototype.height = 300;
    Chart.prototype.width = 700;
    Chart.prototype.label_top_color = '#003D4C';
    Chart.prototype.label_inside_color = '#FFF';
    Chart.prototype.label_inside_key = 'value';
    Chart.prototype.label_padding = 3;
    Chart.prototype.label_size = 16;
    Chart.prototype.label_top_key = 'name';
  
    Chart.prototype.compute_boundaries = function() {
      if (this.auto_scale) {
        this.width = this.container_elem.scrollWidth || this.width;
      }
  
      this.min_bar_size = this.label_size + this.label_padding * 2;
      this.max_bar_size = Math.max(this.min_bar_size, this.height - this.chart_padding - this.label_size - this.label_padding * 2);
      this.data_min = d3.min(this.data, this.data_value_accessor);
      this.data_max = d3.max(this.data, this.data_value_accessor);
  
      this.bar_width = Math.floor((this.width - this.chart_padding * 2 - (this.data.length - 1) * this.bar_spacing) / this.data.length);
      this.label_width = this.bar_width - this.label_padding * 2;
  
      var height_scale = d3.scale.linear().domain([this.data_min, this.data_max]).range([this.min_bar_size, this.max_bar_size])
      this.height_scale = height_scale;
  
      this.x_scale = d3.scale.linear().domain([0, this.data.length - 1]).range([this.chart_padding, this.width - this.chart_padding - this.bar_width])
  
      var baseline = this.height - this.chart_padding;
      var y_scale = function(val) {
        return baseline - height_scale(val);
      };
      this.y_scale = y_scale;
  
      var label_padding = this.label_padding;
      var label_size = this.label_size;
      this.label_top_y_scale = function(val, ctx) {
        var y = y_scale(val) - label_padding;
        if (ctx !== undefined && ctx.scrollHeight)
          y = y - ctx.scrollHeight;
        return y;
      };
    };
  
    Chart.prototype.render = function() {
      if (!this.has_rendered) {
        if (this.container === undefined)
          this.container = document.body;
  
        this.$container = d3.select(this.container).append('div').style('position', 'relative');
        this.container_elem = this.$container[0][0];
  
        if (this.data === undefined || this.data === null || this.data.length == 0)
          return;
  
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
  
      var bars = this.svg.selectAll('rect').data(this.data, this.data_id_key_accessor);
      var labels_top = this.$container.selectAll('.label-top').data(this.data, this.data_id_key_accessor);
      var labels_inside = this.$container.selectAll('.label-inside').data(this.data, this.data_id_key_accessor);
  
      var bars_enter = bars.enter();
      var chart = this;
      if (!bars_enter.empty()) {
        bars_enter = bars_enter.append('rect')
          .attr('x', this.x_scale_accessor)
          .attr('y', this.y_scale(this.data_min))
          .attr('width', this.bar_width)
          .attr('height', this.height_scale(this.data_min))
          .style('fill', this.bar_color);
  
        labels_top.enter().append('div')
          .classed('label-top', true)
          .text(this.label_top_accessor)
          .style('position', 'absolute')
          .style('color', this.label_top_color)
          .style('top', function(d, i) {
            return chart.label_top_y_scale(chart.data_min, this) + 'px';
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
          .data(this.data, this.data_id_key_accessor)
          .style('position', 'absolute')
          .style('color', this.label_inside_color)
          .style('bottom', '0')
          .style('left', '0')
          .style('text-align', 'center')
          .style('width', '100%')
          .text(this.data_min)
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
      if (this.data_min >= 1 && this.data_max < 10000 && this.data_max - this.data_min > 10) {
        labels_inside.selectAll('div')
          .data(this.data, this.data_id_key_accessor)
        .transition()
          .tween('label_inside_text', function(d) {
            var i = d3.interpolateRound(Math.round(chart.data_min), parseInt(chart.data_value_accessor(d)));
            return function(t) {
              this.textContent = i(t);
            };
          })
          .delay(this.animation_delay)
          .duration(this.animation_duration);
      }
      //otherwise, pass them through the prettify_number routine
      else {
        labels_inside.selectAll('div')
          .data(this.data, this.data_id_key_accessor)
          .html(function(d, i) {
            return chart.prettify_number(chart.data_value_accessor(d));
          });
      }
  
      this.has_rendered = true;
    };
  
    //TODO ability to parameterize based on range of dataset?
    Chart.prototype.prettify_number = function(num) {
      var suffixes = ' kMBT';
      var abs = Math.abs(num);
      var mag;
      if (abs < 1)
        mag = Math.floor(Math.log(abs) / Math.LN10);
      else
        //average with magnitude of num + 1 to correct for floating-point error
        mag = Math.floor((Math.log(abs) / Math.LN10 + Math.log(abs + 1) / Math.LN10) / 2);
  
      if (mag >= 3) {
        var index = Math.floor(mag / 3);
        var suffix;
        if (suffixes.length > index)
          suffix = suffixes.charAt(index);
        else
          suffix = '*10<sup>' + mag + '</sup>';
        return (Math.round(num / Math.pow(10, mag - (mag % 3) - 1)) / 10.0) + suffix;
      }
      else if (mag <= -3)
        return Math.round(num / Math.pow(10, mag)) + 'e' + mag;
      else
        return num.toString();
    };
  
    return Chart;
  };
  if (typeof define == 'function' && define.amd) {
    define('barchart', ['d3'], defineBarChart);
  }
  else {
    window.BarChart = defineBarChart(window.d3);
  }
}());
