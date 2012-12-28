define([
  'ember'
],
function(Ember) {
  var Router = Ember.Router.extend({
    root: Ember.Route.extend({
      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router, evnt) {
          router.get('applicationController').connectOutlet('index');
        }
      })
    })
  });
  return Router;
});
