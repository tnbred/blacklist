var mellt = require('mellt');
var models = require(__dirname + "/../../models");

checkPostedParameters = function ( req , callback ){ 
	var email = req.param("email", null);
	var password = req.param("password", null);
	var password_confirmation = req.param("password_confirmation", null);
	if (email && password && password_confirmation) {
		try{
			if(password!==password_confirmation){
				throw "Password doesn't match password confirmation.";	
			}
			else{
				if( mellt.CheckPassword( password ) == 0 ){ 
					throw "your password is too simple  \n try longer combinations or use special characters such as !&,.ç? digits or even sentences like \' theblacklistapp is the best site ever!!!\'";
				}
				else{
					new models.User().query('where', 'email', '=', email).fetch().then( function( user ){
						try{
							if( user ) {  
								throw "This email address is already used."; 
							}	
							else{
								var User = models.User;	
								var user = new User({
									email: email,
									approved: true,
									password: password
								});
								var error = null;
								callback( user , error );	
							}
						}
						catch( error ){
							callback( user , error );
						}
					});						
				}

			}
		}
		catch( error ){
			var user = null;
			callback( user , error );
		}
			

	}
	else{
		var user = null;
		error = null;
		callback( user , error );

	}
}


function redirectRegistration( res , req , user , error ){

	if (error) {
		path = "static/home";
		alert = "alert-danger";
		strongMessage = "Error!"
		message = error;
	}
	else{
		path = "static/login";
		alert = "alert-success";
		strongMessage = "Registration successful!"
		message = "You can now log in!";
	}
	res.render(path, {
		message: [{
			alertType: alert,
			strongMessage: strongMessage,
			messageText: message,
			display: true,
		}],
		metaData: req.metaData,
		user: user
	});
}

exports.checkPostedParameters = checkPostedParameters;
exports.redirectRegistration = redirectRegistration;