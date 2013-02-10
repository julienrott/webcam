package webcam

import com.webcam.*

import grails.events.Listener

import com.opentok.api.OpenTokSDK
import com.opentok.api.constants.SessionProperties

class MyService {
	
	def springSecurityService

	int OPENTOK_API_KEY = 20410932;
	String OPENTOK_API_SECRET = '5024ed347923e3dac034dbdd46197700ee8e02b5';

	//@Listener(namespace='browser', topic='toserver')
	@Listener(namespace='browser')
    void toserver(msg) {
		try {
			event('tobrowser', [text: 'from server'], [:])
		}
		catch (Exception e) {
			log.error e
		}
    }
	
	@Listener(namespace='browser')
	void getinfo(msg) {
		//Person loggedUser = springSecurityService.currentUser
		/*if (loggedUser) {
			if (!loggedUser.currentSession) {
				OpenTokSDK sdk = new OpenTokSDK(OPENTOK_API_KEY, OPENTOK_API_SECRET);
				SessionProperties sp = new SessionProperties();
				sp.p2p_preference = "enabled";
				String sessionId = sdk.create_session("", sp).getSessionId();
				loggedUser.currentSession = sessionId
				loggedUser.save(flush:true)
			}
		}*/
		Person user = Person.findByUsername(msg.username)
		String token = ""
		if (user.currentSession) { 
			OpenTokSDK sdk = new OpenTokSDK(OPENTOK_API_KEY, OPENTOK_API_SECRET);
			token = sdk.generate_token(OPENTOK_API_SECRET)
		}
		tobrowser(msg.from, [sessionId: user.currentSession, token: token, apiKey: OPENTOK_API_KEY])
	}
	
	@Listener(namespace='browser')
	void ping(msg) {
		event('ping-user-' + msg.username, [from: msg.from], [:])
	}
	
	@Listener(namespace='browser')
	void pong(msg) {
		event('pong-user-' + msg.username, [from: msg.from], [:])
	}
	
	void tobrowser(to, data) {
		try {
			event('tobrowser-' + to, data, [:])
		}
		catch(Exception e) {
			log.error e
		}
		
	}
	
	@Listener(namespace='browser')
	void requestCall(msg) {
		event('request-call-' + msg.username, [from: msg.from], [:])
	}
	
	@Listener(namespace='browser')
	void acceptCall(msg) {
		event('accept-call-' + msg.username, [from: msg.from], [:])
	}
	
	@Listener(namespace='browser')
	void refuseCall(msg) {
		event('refuse-call-' + msg.username, [from: msg.from], [:])
	}
	
	@Listener(namespace='browser')
	void stopCall(msg) {
		event('stop-call-' + msg.username, [from: msg.from], [:])
	}
	
}
