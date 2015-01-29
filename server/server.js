
Meteor.startup(function () {
	// code to run on server at startup
});

Meteor.methods({
	getPeerjsApiKey: function() {
		/*var peerjsApiKey = process.env.PEERJS_API_KEY;
		return peerjsApiKey;*/
		return 'a56y7p5nq871ra4i';
	}
});
