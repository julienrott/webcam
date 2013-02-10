import com.webcam.*

class BootStrap {

	def springSecurityService

	def init = { servletContext ->
		def userRole = Role.findByAuthority('ROLE_USER') ?: new Role(authority: 'ROLE_USER').save(failOnError: true)
		def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN').save(failOnError: true)

		def adminUser = Person.findByUsername('admin') ?: new Person(
				username: 'admin',
				password: 'blabla',
				enabled: true).save(failOnError: true)

		if (!adminUser.authorities.contains(adminRole)) {
			PersonRole.create adminUser, adminRole
		}

		def user1 = Person.findByUsername('user1') ?: new Person(
				username: 'user1',
				password: 'user1',
				enabled: true).save(failOnError: true)

		if (!user1.authorities.contains(userRole)) {
			PersonRole.create user1, userRole
		}

		def user2 = Person.findByUsername('user2') ?: new Person(
				username: 'user2',
				password: 'user2',
				enabled: true).save(failOnError: true)

		if (!user2.authorities.contains(userRole)) {
			PersonRole.create user2, userRole
		}

		def user3 = Person.findByUsername('user3') ?: new Person(
				username: 'user3',
				password: 'user3',
				enabled: true).save(failOnError: true)

		if (!user3.authorities.contains(userRole)) {
			PersonRole.create user3, userRole
		}
	}
	def destroy = {
	}
}
