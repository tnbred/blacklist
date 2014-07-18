var models = require(__dirname + "/../models");
var mellt = require('mellt');

checkPostedInfo = function( current_user , user ){
	if (user.current_password === null) throw "No password provided";
	if (!current_user.isPasswordMatching(user.current_password)) throw "Password invalid";
	if (user.password) {
		if (user.password !== user.password_confirmation) throw "password confirmation doesn't match password";
	}
	if (mellt.CheckPassword( user.password ) == 0) {
					throw "your password is too simple  \n try longer combinations or use special characters such as !&,.ç? digits or even sentences like \' theblacklistapp is the best site ever!!!\'";
	} 
}

updatePostedInfo = function( current_user , user ){
	var messageNickname = messageEmail = messagePassword = {};
	if (user.nickname){
		if( current_user.get('nickname')!=user.nickname){
			messageNickname = {
				alertType: "alert-success",
				strongMessage: "Nickname updated!",
				messageText: '',
				display: true
			};
		}
		current_user.set("nickname", user.nickname);
	} 
	if (user.email){
		if( current_user.get('email')!=user.email){
			messageEmail = {
				alertType: "alert-success",
				strongMessage: "Email updated!",
				messageText: '',
				display: true
			};	
		} current_user.set("email", user.email);


	} 
	if (user.password) {
		current_user.set("password", user.password);
		messagePassword = {
			alertType: "alert-success",
			strongMessage: "Password updated!",
			messageText: '',
			display: true
		};
	}
	message = [messageNickname,messageEmail,messagePassword];
	return( message );

}



exports.checkPostedInfo = checkPostedInfo;
exports.updatePostedInfo = updatePostedInfo;

