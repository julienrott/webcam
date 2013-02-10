package com.webcam

class Person {

	transient springSecurityService

	String username
	String password
	boolean enabled
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	
	String currentSession

	static constraints = {
		username blank: false, unique: true
		password blank: false
		currentSession nullable: true
	}

	static mapping = {
		password column: '`password`'
	}

	Set<Role> getAuthorities() {
		PersonRole.findAllByPerson(this).collect { it.role } as Set
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService.encodePassword(password)
	}
}
