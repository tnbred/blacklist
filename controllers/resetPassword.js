var models = require(__dirname + "/../models");

module.exports = function(req, res) {
  try {
    // Try login
    var saltToken = req.param("token", null);
    var sentUser = req.param("user", null);

    if (saltToken) {
      if (sentUser) {
        try {
          console.log( "blabla");
          var newPassword = sentUser["password"];
          var newPasswordConfirmation = sentUser["password_confirmation"]
          if (!(newPassword && newPasswordConfirmation)) throw "You have to fill all the required inputs";
          if (newPassword !== newPasswordConfirmation) throw "Password doesn't match password confirmation";
          new models.User().query('where', 'salt', '=', saltToken).fetch().then(function(user) {
            user.set("password", newPassword)
            user.saltPassword(function(error) {
              user.save().then(function(user) {
                if (error) {
                  res.redirect("/?error=" + error.message);
                } else {
                  req.login(user, function(err) {
                    if (err) {
                      return next(err);
                    }
                    res.redirect("/");
                  });
                }
              })
            })
          })
        } catch (error) {
          res.redirect("/reset/" + saltToken + "?error=" + error);
        }
      } else {
        new models.User().query('where', 'salt', '=', saltToken).fetch().then(function(user) {
          try {
            if (user === null) throw "user-doesnt-exists";
            res.render(
              "static/password", {
                metaData: req.metaData,
                salt: saltToken
              }
            );
          } catch (error) {
            res.redirect("/?error=" + error);
          }
        });
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    // Redirect with error
    res.redirect("/reset/" + saltToken + "?error=" + error.message);
  }
};