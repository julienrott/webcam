
Meteor.startup(function () {
	// code to run on server at startup
});

Meteor.methods({
	getPeerjsApiKey: function() {
		/*var peerjsApiKey = process.env.PEERJS_API_KEY;
		return peerjsApiKey;*/
		return 'a56y7p5nq871ra4i';
	},

	updatePeerId: function(peerId) {
		Meteor.users.update({_id: this.userId}, {$set:{peerId: peerId}});
	},

	gotoDashboard: function() {
		Meteor.users.update({_id: this.userId}, {$set: {gotoDashboard: false}});
	}
});

Accounts.onLogin(function(a) {
	Meteor.users.update({_id: a.user._id}, {$set: {gotoDashboard: true}});
});

Meteor.publish("gotoDashboard", function() {
	return Meteor.users.find({_id: this.userId}, {fields: {gotoDashboard: 1}});
});

Meteor.publish("onlineUsers", function() {
	return Meteor.users.find({"status.online": true});
});
