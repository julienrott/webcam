ApplicationController = RouteController.extend({
  layoutTemplate: 'layoutMain',

  onBeforeAction: function () {
    this.next();
  },

  action: function () {
    this.render()
  }

});