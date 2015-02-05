
Meteor.startup(function () {
	// code to run on server at startup
});

Meteor.methods({
	getPeerjsApiKey: function() {
		/*var peerjsApiKey = process.env.PEERJS_API_KEY;
		return peerjsApiKey;*/
		return 'a56y7p5nq871ra4i';
	},

	gotoDashboard: function() {
		Meteor.users.update({_id: this.userId}, {$set: {gotoDashboard: false}});
	}
});

Accounts.onLogin(function(a) {
	console.log("Accounts.onLogin")
	console.log("just logged in user id : ", a.user._id)
	Meteor.users.update({_id: a.user._id}, {$set: {gotoDashboard: true}});
	//Meteor.Router.go('Dashboard');
});

Meteor.publish("gotoDashboard", function() {
	console.log("Meteor publish gotoDashboard id : ", this.userId);
	return Meteor.users.find({_id: this.userId}, {fields: {gotoDashboard: 1}});
});

Meteor.publish("onlineUsers", function() {
	console.log("Meteor publish onlineUsers id : ", this.userId);
	return Meteor.users.find({"status.online": true});
});
