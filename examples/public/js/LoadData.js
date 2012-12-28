define([
  'ember'
],
function(Ember) {
  var LoadData = Ember.Mixin.create({
    _data: null,
    loadedData: false,
    loadingData: false,

    dataKeyChanged: function() {
      if (this.get('loadedData')) {
        if( this.get('dataKey') ){
          this.set('content', this.get('_data.' + this.get('dataKey')));
        }
        else {
          this.set('content', this.get('_data'));
        }
      }
    }.observes('dataKey'),
    dataUrlChanged: function() {
      this.loadData();
    }.observes('dataUrl'),

    init: function() {
      this._super();
      if (this.get('dataUrl')){
        this.loadData();
      }
      else if( typeof(this.get('dataUrl')) === 'undefined' ){
        throw new Error( "This object does not declare a 'dataUrl' field, which is required for the LoadData Mixin");
      }
    },

    loadData: function() {
      var dataUrl = this.get('dataUrl');
      var dataKey = this.get('dataKey');
      if (dataUrl) {
        this.set('loadingData', true);
        this.set('loadedData', false);

        var controller = this;
        var success = function(data, status, xhr) {
          controller.set('_data', data);

          if (dataKey)
            controller.set('content', controller.get('_data.' + dataKey));
          else
            controller.set('content', controller.get('_data'));

          controller.set('loadingData', false);
          controller.set('loadedData', true);
        };
        var error = function( xhr, status, thrown ){
          console.error("Due to "+status+", unable to load '" + dataUrl+"'", thrown );
        };
        $.ajax({
          url: dataUrl,
          type: 'get',
          dataType: 'json',
          success: success,
          error: error
        });
      }
      else {
        throw new Error( "This object has a blank 'dataUrl' field, it must have a valid URL for the LoadData Mixin");
      }
    }
  });
  return LoadData;
});
