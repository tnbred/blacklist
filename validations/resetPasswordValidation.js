var mellt = require('mellt');


	checkPostedParameters = function( sentUser ){
		var newPassword = sentUser["password"];
		var newPasswordConfirmation = sentUser["password_confirmation"]
		if (!(newPassword && newPasswordConfirmation)) throw "You have to fill all the required inputs";
		if (newPassword !== newPasswordConfirmation) throw "Password doesn't match password confirmation";
		if (mellt.CheckPassword( newPassword ) == 0 ) {
			throw "your password is too simple  \n try longer combinations or use special characters such as !&,.ç? digits or even sentences like \' theblacklistapp is the best site ever!!!\'";
		}; 
	} 

	exports.checkPostedParameters = checkPostedParameters;