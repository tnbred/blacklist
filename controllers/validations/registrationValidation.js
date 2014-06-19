var models = require(__dirname + "/../../models");

checkPostedParameters = function ( req , callback ){ 
	var email = req.param("email", null);
	var password = req.param("password", null);
	var password_confirmation = req.param("password_confirmation", null);


	try{
		if (email && password && password_confirmation) {
			if(password!==password_confirmation) throw "Password doesn't match password confirmation";
			var User = models.User;
			var user = new User({
				email: email,
				approved: true,
				password: password
			});
		}
		else{
			var user = null;
		}
		callback( user , null );	
	}
	catch( error ){
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