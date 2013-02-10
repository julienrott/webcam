<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main"/>
		<title>Welcome to Grails</title>
		<r:require modules="jquery,bootstrap-js,grailsEvents,bootstrap-css,bootstrap-responsive-css"/>
		<script src="http://static.opentok.com/webrtc/v2.0/js/TB.min.js" ></script>
		<script type="text/javascript">
			var sessionId = '${sessionId}';
			var username = '${username }';
			var url = '${createLink(uri: "/")}';
			<g:if test="${sec.username()}">var me = '${sec.username()}';</g:if>
			<g:else>var me = '${new Date().getTime()}'</g:else>
		</script>
	</head>
	<body>
		<div class="row">
			<div id="online-info" class="span2">
				${username } : offline
			</div>
			<span id="user-action">
			</span>
			
			<span id="user-request">
			</span>
		</div>
		<div class="row" style="display:none;">
			<div id="loading">Chargement...</div>
	        <div id="menu">
	            <ul>
	                <li><span id="numberRemoteStreamsDisplay">0</span> connection(s) distante(s)</li>
	                <li><a href="#" id="publishMyVideo">publier ma vidéo</a></li>
	                <li><a href="#" id="stopMyVideo">stopper ma vidéo</a></li>
	                <li><a href="#" id="changeStyle">changer style(<span id="styleDisplay">none</span>)</a></li>
	                <li><a href="#" id="connect">connect</a></li>
	                <li><a href="#" id="disconnect">disconnect</a></li>
	            </ul>
	        </div>
	        
		</div>
		<div id="videos" class="row">
			<div id="localVideo" class="span4">
			</div>
			<div class="span4">
				<div id="remoteVideosContainer" class="span4"></div>
			</div>
		</div>
	</body>
</html>
