package webcam

import com.webcam.*

import com.opentok.api.OpenTokSDK
import com.opentok.api.constants.SessionProperties

import grails.plugins.springsecurity.Secured

class UserController {
	
	def springSecurityService

	int OPENTOK_API_KEY = 20410932;
	String OPENTOK_API_SECRET = '5024ed347923e3dac034dbdd46197700ee8e02b5';
	
    def index() { }
	
	def user() {
		Person loggedUser = springSecurityService.currentUser
		if (loggedUser) {
			if (!loggedUser.currentSession) {
				OpenTokSDK sdk = new OpenTokSDK(OPENTOK_API_KEY, OPENTOK_API_SECRET);
				SessionProperties sp = new SessionProperties();
				sp.p2p_preference = "enabled";
				String sessionId = sdk.create_session("", sp).getSessionId();
				loggedUser.currentSession = sessionId
				loggedUser.save(flush:true)
			}
		}
		Person user = Person.findByUsername(params.username)
		render view: 'user', model: [sessionId: user.currentSession, username: params.username]
	}
}
