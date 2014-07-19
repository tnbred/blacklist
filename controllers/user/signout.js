module.exports = function(req, res) {
  req.logout()
  req.session.signout = true,
  res.redirect("/")
};


/*
messageSignOut = [{
  	alertType: "alert-success",
  	strongMessage: 'Sign out successfull!',
  	messageText: '',
  	display: true
  }];
  res.render(
  	"static/home", {
  		profilePage: true,
  		metaData: req.metaData,
  		message: messageSignOut
  	}
  );
*/