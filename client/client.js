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
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
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

	Meteor.call('getPeerjsApiKey', function(err, apikey) {
		var this_peer = new Peer({key: apikey});
		setPeer(this_peer);
	});

	step1();

});
