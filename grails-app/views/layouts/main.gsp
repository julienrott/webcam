<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><g:layoutTitle default="Grails"/></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<g:layoutHead/>
		<r:layoutResources />
	</head>
	<body>
		<div class="container">
			<div class="row">
				<g:link uri="/">Home</g:link>
				<sec:ifLoggedIn>
					<g:link uri="/${sec.username() }"><sec:username/></g:link> (<g:link controller="logout">Logout</g:link>)
				</sec:ifLoggedIn>
				<sec:ifNotLoggedIn>
					<g:link controller="login">Login</g:link>
				</sec:ifNotLoggedIn>
			</div>
			
			<g:layoutBody/>
		</div>
		<g:javascript library="application"/>
		<r:layoutResources />
	</body>
</html>
