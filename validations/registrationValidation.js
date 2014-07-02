var mellt = require('mellt');
var models = require(__dirname + "/../models");

checkPostedParameters = function(params, callback) {
	var email = params.email
	var password = params.password
	var password_confirmation = params.password_confirmation

	function getMessage(error) {

		if (error) {
			path = "";
			alert = "alert-danger";
			strongMessage = "Error!"
			message = error;
		} else {
			path = "static/login";
			alert = "alert-success";
			strongMessage = "Registration successful!"
			message = "You can now log in!";
		}

		return [{
			alertType: alert,
			strongMessage: strongMessage,
			messageText: message,
			display: true,
		}]

	}

	if (email && password && password_confirmation) {
		try {
			if (password !== password_confirmation) {
				throw "Password doesn't match password confirmation.";
			} else {
				if (mellt.CheckPassword(password) == 0) {
					throw "your password is too simple  \n try longer combinations or use special characters such as !&,.ç? digits or even sentences like \' theblacklistapp is the best site ever!!!\'";
				} else {
					new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
						try {
							if (user) {
								throw "This email address is already used.";
							} else {
								var User = models.User;
								var user = new User({
									email: email,
									approved: true,
									password: password
								});
								var error = null;
								callback(error, user, getMessage(error));
							}
						} catch (error) {
							callback(error, user, getMessage(error));
						}
					});
				}

			}
		} catch (error) {
			var user = null;
			callback(error, user, getMessage(error));
		}


	} else {
		var user = null;
		error = null;
		callback(error, user, getMessage(error));

	}
}



exports.checkPostedParameters = checkPostedParameters;