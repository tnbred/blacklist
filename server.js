var express = require('express');
var mellt = require('mellt');
var Bookshelf  = require('bookshelf')
var config = require(__dirname + "/config");
Bookshelf.PG = Bookshelf.initialize({
  client: 'pg',
  connection: config.PG.PG_URL
});
var flash = require('connect-flash');
var exHb    = require("express3-handlebars");
var cookieParser = require('cookie-parser');
var routes = require(__dirname + "/routes");
var path = require('path');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var mw = require(__dirname + "/middleware");
var passport = require('passport');




var app = express();

app.engine("handlebars", exHb({
  defaultLayout : "main",
  helpers       : require(__dirname + "/presenters/index.js")
  
}));
app.set("view engine", "handlebars");

app.use(cookieParser(config.Cookie.Secret));
app.use(session({ secret: config.Session.Secret, cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }}));
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(express.static(path.join(__dirname, 'views/public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
routes(app)


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(mw.passport);



app.listen(config.port);
console.log('Listening on port '+ config.port );
