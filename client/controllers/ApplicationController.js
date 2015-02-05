ApplicationController = RouteController.extend({
  layoutTemplate: 'layoutMain',

  onBeforeAction: function () {
    //console.log("ApplicationController onBeforeAction")
    this.next();
  },

  action: function () {
    //console.log("ApplicationController action")
  }

});