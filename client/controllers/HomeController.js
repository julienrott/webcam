HomeController = ApplicationController.extend({
  layoutTemplate: 'home',

  action: function() {
  	//console.log("HomeController");

  },

  onLoggedIn: function (){
		console.log("Hooks.onLoggedIn")
		Router.go('Dashboard');
  }

});