
// Define the factory object for Application.js. Since each incoming 
// request has to define a new instance of the Application.js, we 
// have to get around the module-based caching. This gives every 
// request the opportunity to re-define the settings (this is a good
// thing - and a very powerful thing).
module.exports = function( request, response ){


	// Define the application settings.
	this.name = "ColdFusion.js Test App";
	
	// I am the amount of time (in seconds) the application can 
	// sit idle before it timesout. Once timing out, the 
	// onApplicationEnd() event handler will be implicitly invoked,
	// and any subsequent request will boot up a new application. 
	this.applicationTimeout = 15;
	
	// I determine whether or not session management is being used 
	// for this page request. This can be turned on or off for each
	// request.
	this.sessionManagement = true;
	
	// I am the amount of time (in seconds) the session can sit idle
	// before it timesout. Once timing out, the onSessionEnd() event
	// handler is implicitly invoked, and any subsequent request will
	// boot up a new session.
	this.sessionTimeout = 5;
	
	// I determine if the session cookies should be set 
	// automatically by the framework. If true, a sessionID cookie
	// will be sent back to the browser. If false, the cookie needs
	// to be manually set.
	this.setClientCookies = true;
	
	// I am the amount of time the request can run before it is 
	// forced to end (optional - exclude this property for an open-
	// ended response time).
	this.requestTimeout = 5;


	// ------------------------------------------------------ //
	// ------------------------------------------------------ //


	// I initialize the application.
	this.onApplicationStart = function( request, response, callback ){
		
		// Log event handler.
		console.log( ">> Event :: onApplicationStart()" );
		console.log( ">>>> Application Name :: " + request.application.getName() );
		
		// Set an application value.
		request.application.set( "message", "ColdFusion FTW!!" );
		
		// Return true so the rest of the application can load.
		return( callback( true ) );
		
	};


	// I initialize the session.
	this.onSessionStart = function( request, response, callback ){

		// Log event handler.
		console.log( ">> Event :: onSessionStart()" );
		console.log( ">>>> Session ID :: " + request.session.getSessionID() );
		
		// Store a session value.
		request.session.set( "hitCount", 0 );
		
		// Return out so the framework knows the event is over.
		return( callback() );
		
	};


	// I initialize the request.
	this.onRequestStart = function( request, response, callback ){
		
		// Log event handler.
		console.log( ">> Event :: onRequestStart()" );
		
		// Increment the session-based hit-count. Notice that once a
		// value is stored in the session cache, it can be referenced
		// without a getter / setter.
		request.session.hitCount++;
				
		// Return true so the rest of the request can load.
		return( callback( true ) );
		
	};


	// I process the request.
	this.onRequest = function( request, response ){
		
		// Log event handler.
		console.log( ">> Event :: onRequest()" );
		
		// Set the content type.
		response.setHeader( "content-type", "text/html" );
		
		// Write out some content.
		response.write( 
			"<h1>ColdFusion.js On Node.js</h1>" + 
			"<p>Hello - this is page request " + 
				request.session.hitCount +  
			".</p>"
		);
		
		// End the response.
		response.end( 
			"<p>" + 
				request.application.message + 
			"</p>"
		);
			
	};
	
	
	// I tear down the request.
	this.onRequestEnd = function( request, response ){
		
		// Log event handler.
		console.log( ">> Event :: onRequestEnd()" );
		
	};

	
	// I tear down the session.
	this.onSessionEnd = function( applicationScope, sessionScope ){
		
		// Log event handler.
		console.log( ">> Event :: onSessionEnd()" );
		console.log( ">>>> Session ID :: " + sessionScope.getSessionID() );
		
	};


	// I tear down the application.
	this.onApplicationEnd = function( applicationScope ){
		
		// Log event handler.
		console.log( ">> Event :: onApplicationEnd()" );
		console.log( ">>>> Application Name :: " + applicationScope.getName() );
		
	};
	
	
	// I handle any global errors. 
	//
	// NOTE: The request / response objects may NOT be present. If 
	// the error occurred during an asynchronous callback, this 
	// Application.js instance might not even be the one that started
	// the action that ended up raising the exception.
	this.onError = function( error, request, response ){
		
		// Log event handler.
		console.log( ">> Event :: onError()" );
		console.log( ">>>> Error Message :: " + error.message );
		
		// Check to see if there is a response associated with this
		// error is available and is not committed.
		if (
			response &&
			!response.isCommitted()
			){
			
			// Output the error.
			response.write( "<p>An error has occurred: " + error.message + ".</p>" );

		}
		
	};
	
	
};



