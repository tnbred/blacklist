var mellt = require('mellt');
var models = require(__dirname + "/../models");

checkNicknameTuto = function( current_user , nickname ) {
	if( nickname ){
		current_user.set( "nickname" , nickname);
		path = "user/home";
		alert = "alert-success";
		strongMessage = "Welcome to the BlacklistApp "+nickname+"!";
		message = "Choose a black list and vote for the people you hate!";
		return( [{
			alertType: alert,
			strongMessage: strongMessage,
			messageText: message,
			display: true,
		}] )
	}
	else{
		throw "Give a valid Nickname!"
	}

}

exports.checkNicknameTuto = checkNicknameTuto;