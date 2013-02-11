if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

url = window.location.protocol + "//" + window.location.host
var grailsEvents = new grails.Events(url, {transport:'sse'});

$(function() {

	grailsEvents.on('ping-user-' + me, function(data) {
		console.log('ping ' + data.from);
		grailsEvents.send('pong', {from: me, username: data.from});
	});

	grailsEvents.on('pong-user-' + me, function(data) {
		console.log('pong ' + data.from);
		$('#online-info').html(data.from + ' : online');
		if (me !== data.from) {
			$('<a>', {
				href: "#",
				id: 'request-call-btn',
				class: 'btn btn-success',
				text: 'Appeler',
				click: function(e){
					grailsEvents.send('requestCall', {username: username, from : me});
					$(this).attr('disabled', 'disabled');
					
					showCallInProgressLabel();
					
					return false;
				}
			}).appendTo('#user-action');
		}
	});
	
	grailsEvents.on('request-call-' + me, function(data) {
		$('#user-request').html('');
		
		$('<span>', {
			text: 'Appel entrant:',
			class: 'label label-info'
		}).appendTo('#user-request');

		$('<span>', {
			text: ' '
		}).appendTo('#user-request');
		
		$('<a>', {
			href: "#",
			class: 'btn btn-success',
			text: 'Accepter',
			click: function(e){
				grailsEvents.send('acceptCall', {username: data.from, from : me});
				$('#user-request').html('');
				
				var publisherOptions = {width: '300px', height: '300px'};
			    twel.publishMyVideo('localVideo', publisherOptions);
			    
			    $('#localVideo').addClass('span4').prependTo('#videos');
				
			    showStopCallButton(data.from);
			    
				return false;
			}
		}).appendTo('#user-request');

		$('<span>', {
			text: ' '
		}).appendTo('#user-request');
		
		$('<a>', {
			href: "#",
			class: 'btn btn-danger',
			text: 'Refuser',
			click: function(e){
				grailsEvents.send('refuseCall', {username: data.from, from : me});
				$('#user-request').html('');
				return false;
			}
		}).appendTo('#user-request');
	});

	grailsEvents.on('accept-call-' + me, function(data) {
		var publisherOptions = {width: '300px', height: '300px'};
	    twel.publishMyVideo('localVideo', publisherOptions);
	    
	    $('#localVideo').addClass('span4').prependTo('#videos');

	    showStopCallButton(data.from);

	    showCallAcceptedLabel();
	});

	grailsEvents.on('refuse-call-' + me, function(data) {
		showCallRefusedLabel();
		
		$('#request-call-btn').removeAttr('disabled');
	});

	grailsEvents.on('stop-call-' + me, function(data) {
		twel.stopMyVideo();
		$('#user-request').html('');
		$('#user-action').html('');
		grailsEvents.send('ping', {username: username, from : me});
	});

	grailsEvents.on('tobrowser-' + me, function(data){
		console.log(data);
		if(data.sessionId) {
			twel.init({sessionId: data.sessionId, apiKey: data.apiKey, token: data.token});
			twel.initSession();
			twel.connect();
		    
		    twel.session.addEventListener("sessionConnected", sessionConnectedHandler);
		    twel.session.addEventListener("sessionDisconnected", sessionDisconnectedHandler);
		    twel.session.addEventListener("streamCreated", streamCreatedHandler);
		    twel.session.addEventListener("streamDestroyed", streamDestroyedHandler);
		    twel.session.addEventListener("connectionCreated", connectionCreatedHandler);
		    twel.session.addEventListener("connectionDestroyed", connectionDestroyedHandler);
		}
	});

	grailsEvents.send('getinfo', {username: username, from : me});
	grailsEvents.send('ping', {username: username, from : me});

});

function showCallInProgressLabel() {
	$('#user-request').html('');
	
	$('<span>', {
		text: 'Appel en cours',
		class: 'label label-info'
	}).appendTo('#user-request');
}

function showCallAcceptedLabel() {
	$('#user-request').html('');
	
	$('<span>', {
		text: 'Appel accepté',
		class: 'label label-success'
	}).appendTo('#user-request');
}

function showCallRefusedLabel() {
	$('#user-request').html('');
	
	$('<span>', {
		text: 'Appel refusé',
		class: 'label label-important'
	}).appendTo('#user-request');
}

function showStopCallButton(from) {
	$('#user-action').html('');
    
    $('<a>', {
		href: "#",
		class: 'btn btn-danger',
		text: 'Arrêter',
		click: function(e){
			twel.stopMyVideo();
			grailsEvents.send('stopCall', {username: from, from : me});
			$('#user-request').html('');
			$('#user-action').html('');
			grailsEvents.send('ping', {username: username, from : me});
			return false;
		}
	}).appendTo('#user-action');
}

function sessionConnectedHandler(event) {
    document.getElementById('loading').style.display = "none";
    /*$("#publishMyVideo").show();
    $("#stopMyVideo").hide();
    $("#connect").hide();
    $("#disconnect").show();*/
    subscribeToStreams(event.streams);
    remoteStreams = event.connections.length;
    $("#numberRemoteStreamsDisplay").html(remoteStreams);
}

function sessionDisconnectedHandler(event) {
    /*$("#publishMyVideo").hide();
    $("#stopMyVideo").hide();
    $("#connect").show();
    $("#disconnect").hide();*/
    streamDestroyedHandler(event);
}

function streamCreatedHandler(event) {
    subscribeToStreams(event.streams);
}

function subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].connection.connectionId != twel.session.connection.connectionId) {
            var div = document.createElement('div');
            div.setAttribute('id', 'stream' + streams[i].streamId);
            div.setAttribute('class', 'remoteStream');

            var streamsContainer = document.getElementById('remoteVideosContainer');
            streamsContainer.appendChild(div);

            subscriber = twel.session.subscribe(streams[i], 'stream' + streams[i].streamId,
                        {width: '300px', height: '300px'});
            //updateVideoSize();
        }
    }
}

function streamDestroyedHandler(event) {
  if (event.streams)
    for (var i = 0; i < event.streams.length; i++) {
        var stream = event.streams[i];
        if (stream.connection.connectionId != twel.session.connection.connectionId) {
            var div = $("#stream" + stream.id);
            div.remove();
            //updateVideoSize();
        }
    }
}

function connectionCreatedHandler(event) {
    remoteStreams += event.connections.length;
    $("#numberRemoteStreamsDisplay").html(remoteStreams);
}

function connectionDestroyedHandler(event) {
    remoteStreams -= event.connections.length;
    $("#numberRemoteStreamsDisplay").html(remoteStreams);
}

function publishMyVideo() {
    var publisherOptions = {width: '300px', height: '300px'};
    twel.publishMyVideo('localVideo', publisherOptions);
    
    /*$("#publishMyVideo").hide();
    $("#stopMyVideo").show();
    $("#changeStyle").show();
    $("#localVideo").show();
    $("#localVideo").css("display", "inline-block");*/
    
    //updateVideoSize();
    
    $('#localVideo').addClass('span4').prependTo('#videos');
    return false;
}

function stopMyVideo() {
    twel.stopMyVideo();
    
    /*$("#publishMyVideo").show();
    $("#stopMyVideo").hide();
    $("#changeStyle").hide();
    $("#localVideo").hide();*/
    
    //updateVideoSize();
    
    return false;
}

function changeStyle() {
    var localVideo = $("#localVideo");
    localVideo.removeClass(styles[styleIndex]);
    styleIndex++;
    if (styleIndex === styles.length) {
        styleIndex = 0;
    }
    localVideo.addClass(styles[styleIndex]);
    $('#styleDisplay').html(styles[styleIndex]);
    return false;
}

function updateVideoSize() {
    if (remoteStreams === 0){
        $("#localVideo").removeClass("mini");
    }
    else {
        $("#localVideo").addClass("mini");
    }
}

function connect() {
  twel.connect();
}

function disconnect() {
  twel.disconnect();
}

$("#publishMyVideo").click(publishMyVideo);
$("#stopMyVideo").click(stopMyVideo);
$("#changeStyle").click(changeStyle);
$("#connect").click(connect);
$("#disconnect").click(disconnect);
