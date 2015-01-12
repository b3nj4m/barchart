//TODO unit tests
//TODO trend lines
//TODO support overlay as well as side-by-side
//TODO warnings about bad heightScale + domain choices
//TODO should have pretty set of default colors for up to X datasets
//TODO hover states and click events
//TODO allow user to artificially override the extrema
//TODO allow as much as possible to be overriden with css
//TODO graceful failure when data is missing values or labels, etc.
//TODO tooltip showing full value
//TODO best way to implement tooltip without coupling to a particular library?

(function() {
  function defineBarChart(d3, _, Q) {
    function getId(d, i) {
      return d.__chartPointId;
    }

    function getValue(d, i) {
      return d.__chartPointValue;
    }

    function getLabelTop(d, i) {
      return d.__chartLabelTop;
    }

    function getLabelInside(d, i) {
      return d.__chartLabelInside;
    }

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

    function byDatasetIndex(fn, numDatasets) {
      var idx = byIndex(fn);
      return function(d, i) {
        return idx(d, i % numDatasets);
      };
    }

    function BarChart(options) {
      if (options) {
        _.extend(this, options);
      }
    };

    BarChart.prototype.data = function(data, dataIdKey) {
      if (!_.isArray(data)) {
        console.warn('Data should be an array.');
        data = [data];
      }
      if (typeof dataIdKey !== 'undefined') {
        this.dataIdKey = dataIdKey;
      }

      if (!_.isArray(data[0])) {
        data = [data];
      }

      this.numDatasets = data.length;
      this.datasetSize = d3.max(data, function(arr) { return arr.length; });

      data = _.flatten(_.zip.apply(_, data));

      var chart = this;

      data = _.map(data, function(point, idx) {
        var isNumber = _.isNumber(point);
        var obj = isNumber ? {} : point;

        //create ID prefixed with dataset number
        obj.__chartPointId = isNumber || !chart.dataIdKey ? idx : (Math.floor(idx / chart.datasetSize) + 1) + ':' + obj[chart.dataIdKey];
        obj.__chartLabelInside =  isNumber ? null : obj[chart.labelInsideKey];
        obj.__chartLabelTop = isNumber ? null : obj[chart.labelTopKey];
        obj.__chartPointValue = isNumber ? point : obj[chart.dataValueKey];

        return obj;
      });

      var extrema = d3.extent(_.map(data, getValue));
      this._minimum = _.isNull(this.minimum) ? extrema[0] : this.minimum;
      this._maximum = _.isNull(this.maximum) ? extrema[1] : this.maximum;

      this._data = data;

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
  
    BarChart.prototype.animationDelay = function(d, i) {
      return i * 100;
    };
  
    BarChart.prototype.container = null;
    BarChart.prototype.hasRendered = false;
    BarChart.prototype.isAnimated = true;
    BarChart.prototype.animationDuration = 600;
    BarChart.prototype.autoScale = false;
    BarChart.prototype.heightScaleType = 'linear';
    BarChart.prototype.barColors = '#00AB8E';
    BarChart.prototype.barSpacing = 2;
    BarChart.prototype.groupSpacing = 8;
    BarChart.prototype.chartPadding = 0;
    BarChart.prototype.numDatasets = 0;
    BarChart.prototype.minimum = null;
    BarChart.prototype.maximum = null;
    BarChart.prototype.dataIdKey = null;
    BarChart.prototype.dataValueKey = 'value';
    BarChart.prototype.height = 300;
    BarChart.prototype.width = 700;
    BarChart.prototype.labelTopColors = '#003D4C';
    BarChart.prototype.labelInsideColors = '#FFF';
    BarChart.prototype.labelInsideKey = 'value';
    BarChart.prototype.labelPadding = 3;
    BarChart.prototype.labelSize = 16;
    BarChart.prototype.labelTopKey = 'name';
  
    //TODO break this down into separate functions so you can override individual calculations
    BarChart.prototype.computeBoundaries = function() {
      var chart = this;

      if (this._data.length === 0) {
        return;
      }

      this.minBarSize = this.labelSize + this.labelPadding * 2;
      this.maxBarSize = Math.max(this.minBarSize, this.height - this.chartPadding - this.labelSize - this.labelPadding * 2);

      this.barWidth = Math.floor((this.width - this.chartPadding * 2 - (this._data.length - 1) * this.barSpacing - (this.datasetSize - 1) * this.groupSpacing) / this._data.length);
      this.labelWidth = this.barWidth - this.labelPadding * 2;
  
      var heightScale = d3.scale[this.heightScaleType]()
        .domain([1, this._maximum - this._minimum + 1])
        .range([this.minBarSize, this.maxBarSize]);

      this.heightScale = function(val) {
        //shift domain to [1, max - min + 1] so it plays-nice with log, etc.
        return heightScale(val + 1 - chart._minimum);
      };
      this.heightScale.invert = function(val) {
        return heightScale.invert(val) + chart._minimum - 1;
      };

      //record-group scale which maps group number to x-coord of left-most bar in the group
      var groupXScale = d3.scale.linear()
        .domain([0, this.datasetSize - 1])
        .range([this.chartPadding, this.width - this.chartPadding - this.barWidth * this.numDatasets - (this.numDatasets - 1) * this.barSpacing]);

      //record scale which maps idx within record-group to offset inside record group
      var barXScale = d3.scale.linear()
        .domain([0, this.numDatasets - 1])
        .range([0, (this.numDatasets - 1) * (this.barWidth + this.barSpacing)]);

      this.xScale = function(idx) {
        var groupNum = Math.floor(idx / chart.numDatasets);
        var datasetNum = idx % chart.numDatasets;
        return groupXScale(groupNum) + barXScale(datasetNum);
      };
  
      var baseline = this.height - this.chartPadding;
      this.yScale = function(val) {
        return baseline - chart.heightScale(val);
      };
  
      this.labelTopYScale = function(val) {
        var y = chart.yScale(val) - chart.labelPadding;
        if (this.scrollHeight) {
          y = y - this.scrollHeight;
        }
        return y;
      };
    };
  
    BarChart.prototype.render = function() {
      if (!this.$container) {
        if (this.container === undefined) {
          this.container = document.body;
        }

        this.$container = d3.select(this.container).append('div').style('position', 'relative');
        this.containerElem = this.$container[0][0];
      }

      if (this.autoScale) {
        this.width = this.containerElem.scrollWidth || this.width;
      }

      this.$container
        .style('height', this.height + 'px')
        .style('width', this.width + 'px');

      if (this._data === undefined || this._data.length == 0) {
        this.$container.classed('no-data', true);
        this.svg.remove();
        delete this.svg;
        return;
      }
      else {
        this.$container.classed('no-data', false);
      }

      this.computeBoundaries();

      if (!this.isAnimated) {
        this.animationDelay = 0;
        this.animationDuration = 0;
      }

      if (!this.svg) {
        this.svg = this.$container.append('svg')
          .attr('height', this.height)
          .attr('width', this.width);
      }

      if (d3.scale[this.heightScaleType] === undefined) {
        console.warn('Invalid heightScaleType "' + this.heightScaleType + '", using "' + BarChart.prototype.heightScaleType + '" instead.');
        this.heightScaleType = BarChart.prototype.heightScaleType;
      }
  
      var bars = this.svg.selectAll('rect').data(this._data, getId);
      var labelsTop = this.$container.selectAll('.label-top').data(this._data, getId);
      var labelsInside = this.$container.selectAll('.label-inside').data(this._data, getId);
  
      var chart = this;

      Q.all([
        this.addNewBars(bars),
        this.addNewLabelsTop(labelsTop),
        this.addNewLabelsInside(labelsInside)
      ]).then(function() {
        return Q.all([
          chart.removeOldBars(bars),
          chart.removeOldLabelsTop(labelsTop),
          chart.removeOldLabelsInside(labelsInside)
        ]);
      }).then(function() {
        return Q.all([
          chart.transitionBars(bars),
          chart.transitionLabelsTop(labelsTop),
          chart.transitionLabelsInside(labelsInside)
        ]);
      });
     
      this.hasRendered = true;
    };

    BarChart.prototype.addNewBars = function(bars) {
      var enter = bars.enter();

      if (!enter.empty()) {
        enter = enter.append('rect')
          .attr('x', byIndex(this.xScale))
          .attr('y', this.yScale(this._minimum))
          .attr('width', this.hasRendered ? '0' : this.barWidth)
          .attr('height', this.heightScale(this._minimum))
          .style('opacity', this.hasRendered ? '0' : '1')
          .style('fill', byDatasetIndex(this.barColors, this.numDatasets));
      }

      return Q(enter);
    };

    BarChart.prototype.addNewLabelsTop = function(labelsTop) {
      var enter = labelsTop.enter();

      if (!enter.empty()) {
        enter = enter.append('div')
          .classed('label-top', true)
          .text(getLabelTop)
          .style('position', 'absolute')
          .style('color', byDatasetIndex(this.labelTopColors, this.numDatasets))
          .style('top', this.labelTopYScale(this._minimum, this) + 'px')
          .style('left', px(byIndex(this.xScale)))
          .style('width', this.hasRendered ? '0' : this.barWidth + 'px')
          .style('opacity', this.hasRendered ? '0' : '1')
          .style('line-height', this.labelSize + 'px')
          .style('text-align', 'center');
      }

      return Q(enter);
    };

    BarChart.prototype.addNewLabelsInside = function(labelsInside) {
      var enter = labelsInside.enter();

      if (!enter.empty()) {
        enter = enter.append('div')
          .classed('label-inside', true)
          .style('position', 'absolute')
          .style('overflow', 'hidden')
          .style('top', px(_.compose(this.yScale, getValue)))
          .style('left', px(byIndex(this.xScale)))
          .style('width', this.hasRendered ? '0' : this.barWidth + 'px')
          .style('opacity', this.hasRendered ? '0' : '1')
          .style('height', px(_.compose(this.heightScale, getValue)))
          .append('div')
            .style('position', 'absolute')
            .style('color', byDatasetIndex(this.labelInsideColors, this.numDatasets))
            .style('bottom', '0')
            .style('left', '0')
            .style('text-align', 'center')
            .style('width', '100%')
            .text(this._minimum);
      }

      return Q(enter);
    };

    BarChart.prototype.removeOldBars = function(bars) {
      var exit = bars.exit();

      if (exit.empty()) {
        return Q(bars);
      }
      else {
        return this.transitionPromise(exit.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .attr('width', '0')
          .style('opacity', '0')
          .remove());
      }
    };

    BarChart.prototype.removeOldLabelsTop = function(labelsTop) {
      var exit = labelsTop.exit();

      if (exit.empty()) {
        return Q(labelsTop);
      }
      else {
        return this.transitionPromise(exit.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .style('width', '0')
          .style('opacity', '0')
          .remove());
      }
    };

    BarChart.prototype.removeOldLabelsInside = function(labelsInside) {
      var exit = labelsInside.exit();

      if (exit.empty()) {
        return Q(labelsInside);
      }
      else {
        return this.transitionPromise(exit.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .style('width', '0')
          .style('opacity', '0')
          .remove());
      }
    };

    BarChart.prototype.transitionBars = function(bars) {
      if (bars.empty()) {
        return Q(bars);
      }
      else {
        return this.transitionPromise(bars.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .style('opacity', '1')
          .attr('height', px(_.compose(this.heightScale, getValue)))
          .attr('width', this.barWidth)
          .attr('x', byIndex(this.xScale))
          .attr('y', _.compose(this.yScale, getValue)));
      }
    };

    BarChart.prototype.transitionLabelsTop = function(labelsTop) {
      if (labelsTop.empty()) {
        return Q(labelsTop);
      }
      else {
        return this.transitionPromise(labelsTop.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .style('opacity', '1')
          .style('width', this.barWidth + 'px')
          .style('left', px(byIndex(this.xScale)))
          .style('top', px(_.compose(this.labelTopYScale, getValue))));
      }
    };

    BarChart.prototype.transitionLabelsInside = function(labelsInside) {
      var chart = this;

      if (labelsInside.empty()) {
        return Q(labelsInside);
      }
      else {
        var labelsInsideTransition = labelsInside.transition()
          .delay(this.animationDelay)
          .duration(this.animationDuration)
          .style('opacity', '1')
          .style('left', px(byIndex(this.xScale)))
          .style('width', this.barWidth + 'px');
    
        //if we have positive numbers less than 5 digits in length, animate them!
        if (this._minimum >= 0 && this._maximum < 10000 && this._maximum - this._minimum > 10) {
          labelsInsideTransition.tween('labelInsideText', function(d) {
            var $this = d3.select(this);
            var textDiv = $this.select('div')[0][0];
            var start = parseInt($this.style('height')) || chart.minBarSize;

            //using heightScale to ensure that the values shown are consistent with the exact scale of the graph
            var tickScale = d3.scale.linear()
              .domain([0, 1])
              .range([start, chart.heightScale(getValue(d))]);

            return function(t) {
              textDiv.textContent = Math.round(chart.heightScale.invert(tickScale(t)));
            };
          });
        }
        //otherwise, pass them through the prettifyNumber routine
        else {
          //TODO make sure this still works
          labelsInside.selectAll('div')
            .html(this.prettifyNumber);
        }

        return this.transitionPromise(labelsInsideTransition);
      }
    };
  
    BarChart.prototype.LN10x2 = Math.LN10 * 2;
    //TODO ability to parameterize based on domain of dataset?
    BarChart.prototype.prettifyNumber = function(num) {
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

    BarChart.prototype.transitionPromise = function(transition) {
      var defer = Q.defer();
      var count = 0;
      var size = transition.size();

      transition.each('end', function() {
        count++;
        if (count === size) {
          defer.resolve(transition);
        }
      });

      return defer.promise;
    };
 
    return BarChart;
  };

  if (typeof define === 'function' && define.amd) {
    define('barchart', ['d3', 'underscore', 'q'], defineBarChart);
  }
  else if (typeof exports === 'object' && typeof module !== 'undefined' && typeof require === 'function') {
    module.exports = defineBarChart(require('d3'), require('underscore'), require('q'));
  }
  else {
    BarChart = defineBarChart(d3, _, Q);
  }
}());
