var models = require(__dirname + "/../models");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


var strategy =  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
  	new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
  		if(!user) done(null, false, { message: 'Incorrect email.' })
  		if (!user.isPasswordMatching(password)) done(null, false, { message: 'Incorrect password.' })
      if (user.get("approved") !== true) done(null, false, { message: 'User not yet approved.' });
  		return done(null, user);
  	})
  }
)

module.exports = strategy 


