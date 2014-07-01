var models = require(__dirname + "/../models");

module.exports = function(req, res) {
	message = [{
		alertType: "alert-danger",
		strongMessage: "Error!",
		messageText: req.flash( 'error' )[0],
		display: true
	}];
	if( !message[0].messageText ){ message = null;}
	console.log( message );
	res.render(
		"static/login", {
			metaData: req.metaData,
			message: message
		}
	)
}

