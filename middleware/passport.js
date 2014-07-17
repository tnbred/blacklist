var models = require(__dirname + "/../models");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = new models.User;

var strategy =  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
      if(!user){
          return done(null, false, { message: 'Incorrect email.'})
      } 
      if (!user.isPasswordMatching(password)){
        return done(null, false, { message: 'Incorrect password.' });
      } 
      if (user.get("approved") !== true){
        return done(null, false, { message: 'User not yet approved.' });
      } 
      var logCount = user.get( "logincount" ) + 1;
      if( logCount == null ){
        logCount = 0;
      } 
      user.attributes.logincount = logCount; 
      return done(null, user )
    })
  }
)

module.exports = strategy 
