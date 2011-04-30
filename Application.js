
// Define the factory object for Application.js. Since each incoming 
// request has to define a new instance of the Application.js, we 
// have to get around the module-based caching.
module.exports = function( request, response ){


	// Define the application settings.
	this.name = "ColdFusion.js Test App";
	
	// I am the amount of time (in seconds) the application can sit idle.
	this.applicationTimeout = 10;
	
	// I determine whether or not session management is being used for 
	// this page request. This can be turned on or off for each request.
	this.sessionManagement = true;
	
	// I am the amount of time (in seconds) the session can sit idle.
	this.sessionTimeout = 5;
	
	// I determine if the session cookies should be set automatically.
	// If false, we will need to manually set the cookies.
	this.setClientCookies = true;
	
	// I am the amount of time the request can run before it is forced to
	// end (optional - exclude this for an open-ended response).
	this.requestTimeout = 5;


	// ------------------------------------------------------ //
	// ------------------------------------------------------ //


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
		
		response.cookies.set( "foo", "bar" );
		
		return( callback() );
		
	}


	// I initialize the request.
	this.onRequestStart = function( request, response, callback ){
		
		console.log( "[Request Start]" );
		
		request.session.hitCount++;
		
		if (request.session.hitCount == 4){

			response.cookies.remove( "foo" );

		}
		
		request.session.set( "blam", "blammy" );
		request.session.blam = "floozy";
		request.session.remove( "blam" );
		
		
		// Indicate that we want the request to load.
		return( callback( true ) );
		
	}


	// I process the request.
	this.onRequest = function( request, response ){
		
		console.log( "[Request]" );
		
		response.setHeader( "content-type", "text/html" );
		response.write( "<h1>ColdFusion.js On Node.js</h1>" );
		response.write( "<p>Hello - this is page request " + request.session.get( "hitCount" ) + ".</p>" );
		response.end( "<p>Word up!!.</p>" );
			
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
	this._onError = function( error, request, response ){
		
		console.log( "Uh oh! an error occurred!" );
		
		// Check to see if there is a response associated with this
		// error. 
		if (response){
			
			// Output the error.
			response.write( "An error has occurred: " + error.message );

		}
		
	}
	
	
};



