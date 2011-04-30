
// Define the factory object for Application.js. Since each incoming 
// request has to define a new instance of the Application.js, we 
// have to get around the module-based caching.
module.exports = function( request, response ){


	// Define the application settings.
	//
	// NOTE: This name property isn't currently used for anything since each 
	// node instance will service just one application.
	this.name = "ColdFusionNodeJSApp";
	
	// I am the amount of time (in seconds) the application can sit idle.
	this.applicationTimeout = (5 * 60);
	
	// I determine whether or not session management is being used for 
	// this page request. This can be turned on or off for each request.
	this.sessionManagement = true;
	
	// I am the amount of time (in seconds) the session can sit idle.
	this.sessionTimeout = (1 * 10);
	
	// I determine if the session cookies should be set automatically.
	// If false, we will need to manually set the cookies.
	this.setClientCookies = true;
	
	// I am the amount of time the request can run before it is forced to
	// end (optional - exclude this for an open-ended response).
	this.requestTimeout = 1;


	// -- Event handlers. -- //
	

	// I initialize the application.
	this.onApplicationStart = function( request, response, callback ){
		
		console.log( "[Application Start]" );
		
		// Indicate that we want the application to load.
		return( callback( true ) );
		
	}


	// I initialize the session.
	this.onSessionStart = function( request, response, callback ){
		
		console.log( "[Session Start]" );
		console.log( "Session ID: " + request.session.getSessionID() );
		
		request.session.set( "hitCount", 0 );
		
		return( callback() );
		
	}


	// I initialize the request.
	this.onRequestStart = function( request, response, callback ){
		
		console.log( "[Request Start]" );
		
		var hitCount = request.session.get( "hitCount" );
		
		request.session.set( "hitCount", ++hitCount );
		
		
		
		// Indicate that we want the request to load.
		return( callback( true ) );
		
	}


	// I process the request.
	this.onRequest = function( request, response ){
		
		console.log( "[Request]" );
		
		response.setHeader( "content-type", "text/html" );
		response.write( "<h1>ColdFusion.js On Node.js</h1>" );
		response.write( "<p>Hello - this is page request " + request.session.get( "hitCount" ) + ".</p>" );
		// response.end( "<p>Word up.</p>" );
			
	}
	
	
	// I tear down the request.
	this.onRequestEnd = function( request, response ){
		
		console.log( "[Request End]" );
		
	}

	
	// I tear down the session.
	this.onSessionEnd = function( applicationScope, sessionScope ){
		
		console.log( "[Session End]" );
		console.log( "Session ID: " + sessionScope.getSessionID() );
		
	}


	// I tear down the application.
	this.onApplicationEnd = function( applicationScope ){
		
		console.log( "[Application End]" );
		
	}
	
	
	// I handle any global errors. 
	//
	// NOTE: The request / response objects may NOT be present. If 
	// the error occurred during an asynchronous callback, this 
	// Application.js instance might not even be the one that started
	// the action that ended up raising the exception.
	this.onError = function( error, request, response ){
		
		console.log( "Uh oh! an error occurred!" );
		
	}
	
	
};



