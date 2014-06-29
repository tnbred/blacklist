var controllers = require(__dirname + "/../controllers")
var mw = require(__dirname + "/../middleware")
var passport = require('passport')

module.exports = function(app) {
  var publicRoutes = [
    "/",
    "/login",
    "/reset/*",
    "/reset",
    "/healthcheck",
    "/signup"
  ];

  app.all("/*", mw.checkSessions(publicRoutes));

  app.route("/")
    .get(controllers.home)
    .post(controllers.home)

  app.route("/healthcheck")
    .get(controllers.healthcheck)

  app.route("/login")
    .get(controllers.login)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))

  app.route("/reset")
    .get(controllers.sendPassword)
    .post(controllers.sendPassword)

  app.route("/reset/:token")
    .get(controllers.resetPassword)
    .post(controllers.resetPassword)

  //User routes
  app.route("/user/signout")
    .get(controllers.user.signout)

  app.route("/user/home")
    .get(controllers.user.home)

  app.route("/user/profile")
    .get(controllers.user.profile)
    .post(controllers.user.updateProfile)

  //List routes
  app.route("/user/listData")
    .get(controllers.list.listData)

  app.route("/lists/:id")
    .get(controllers.list.show)

  //Votes routes
  app.route("/votes")
    .post(controllers.vote.create)

  //Comments routes
  app.route("/comments")
    .post(controllers.comment.create)

}