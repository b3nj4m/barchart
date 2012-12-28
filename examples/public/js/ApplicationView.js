define([
  'ember',
  'hbs!template/app'
],
function(Ember, appTemplate) {
  var ApplicationView = Ember.View.extend({
    template: appTemplate
  });
  return ApplicationView;
});
