Router.configure({
  // this will be the default controller
  controller: 'ApplicationController'
});

Router.route('/', {
  name: 'Home',
  controller: 'HomeController'
});

Router.route('/dashboard', {
  name: 'Dashboard',
  controller: 'DashboardController'
});

Router.onBeforeAction(function () {
  if (!Meteor.user()) {
    //this.redirect('/');
    Router.go('Home');
  } else {
    this.next();
  }
});
