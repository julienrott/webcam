var peer;
var peerDep = new Deps.Dependency;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var getPeer = function() {
	peerDep.depend();
	return peer;
};

var setPeer = function(newPeer) {
	peer = newPeer;

	peer.on('open', function(id) {
		peerDep.changed();
	});

	peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    step3(call);
  });

  peer.on('error', function(err){
    console.error(err.type);
    console.error(err.message);
    if(err.type === 'unavailable-id') {
      //peer.reconnect();
      //step1();
      Meteor.setTimeout(function() {
        createPeer();
      }, 3000);
    }
    else if(err.type === 'network') {
      createPeer();
    }
    else {
      console.error(err.type);
      console.error(err.message);
      // Return to step 2 if error occurs
      step2();
    }
  });

	peerDep.changed();
};

Template.sidebar.helpers({
	peerId: function() {
		var this_peer = getPeer();
		if(this_peer) {
			return this_peer.id;
		}
		else {
			return "Not yet connected.";
		}
	}
});

Template.userInfos.events({
  
});

Template.layoutMain.events({
  "click #step1-retry": function(event, template) {
    $('#step1-error').hide();
    step1();
    return false;
  }
});

Template.userInfos.helpers({
  
});

Template.onlineUsers.events({
  "click button": function() {
    var call = peer.call("AlloDoc_" + this._id, window.localStream);
    step3(call);
    return false;
  }
});

Template.onlineUsers.helpers({
  username: function() {
    return this.emails[0].address;
  },

  displayCallButton: function() {
    return this._id !== Meteor.userId();
  },

  onlineUsers: function() {
    var onlineUsers = Meteor.users.find({"status.online": true});
    console.log("onlineUsers : " + onlineUsers.fetch());
    return onlineUsers;
  },

  labelClass: function() {
    if (this.status.idle)
      return "label-warning"
    else if (this.status.online)
      return "label-success"
    else
      return "label-default"
  }
});

Template.main.events({
	"click #make-call": function(event, template) {
    var call = peer.call($('#callto-id').val(), window.localStream);
    step3(call);
    return false;
	},

	"click #end-call": function(event, template) {
		window.existingCall.close();
    step2();
    return false;
	},

	"click #step1-retry": function(event, template) {
		$('#step1-error').hide();
    step1();
    return false;
	}
});

function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream) {
    // Set your video displays
    $('#local-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

function step2 () {
  $('#step1, #step3').hide();
  $('#step2').show();
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#remote-video').prop('src', URL.createObjectURL(stream));
  });

  // UI stuff
  window.existingCall = call;
  $('#their-id').text(call.peer);
  call.on('close', step2);
  $('#step1, #step2').hide();
  $('#step3').show();
}

$(document).ready(function() {
	$('.themes').bootswatch();

	//step1();

  Tracker.autorun(function(c) {
    console.log("Tracker 1");
    /*if(!Meteor.userId()) {
      console.log("Tracker 2");
      return;
    }
    console.log("Tracker 3");
    c.stop();*/

    var gotoDashboard2 = Meteor.users.find({_id: Meteor.userId()});

    gotoDashboard2.observe({
      added: function(document) {
        console.log("gotoDashboard2 observe added ", document);
        if(document.gotoDashboard) {
          Meteor.call('gotoDashboard', function(err, result) {
            createPeer();
            Router.go('Dashboard');
          });
        }
      },
      changed: function(newDocument, oldDocument) {
        console.log("gotoDashboard2 observe changed ", newDocument, oldDocument);
        if(newDocument.gotoDashboard) {
          Meteor.call('gotoDashboard', function(err, result) {
            createPeer();
            Router.go('Dashboard');
          });
        }
      }
    });

  });

});

var gotoDashboard = Meteor.subscribe("gotoDashboard", {}, function() {
  console.log("Meteor subscribe gotoDashboard");
});

var createPeer = function() {

  Meteor.call('getPeerjsApiKey', function(err, apikey) {
    var peerId = "AlloDoc_" + Meteor.userId();
    var this_peer = new Peer(peerId, {key: apikey});
    setPeer(this_peer);
  });

};

Meteor.subscribe("onlineUsers", {}, function() {
  console.log("Meteor subscribe onlineUsers");
});
