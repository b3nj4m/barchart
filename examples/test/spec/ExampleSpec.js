define([
  'ember',
  'jquery',
  'hbs!template/app'
],
function(Ember, $, appTemplate) {
  describe("Example Spec", function() {
    it("should be able to access Ember", function() {
      expect(Ember).toBeDefined();
    });
    it("should be able to access Ember.Handlebars", function() {
      expect(Ember.Handlebars).toBeDefined();
    });
    it("should be able to access jQuery", function() {
      expect($).toBeDefined();
    });
    it("should be able to access app.hbs", function() {
      expect(appTemplate).toBeDefined();
    });
  });
});
