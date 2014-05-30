var models = require(__dirname + "/../models");

module.exports = function(req, res) {
  try {
    // Try login
    var email = req.param("email", null);
    var password = req.param("password", null);

    if (email && password) {

      models.User.findByEmail(email, function(error, user) {
        if (error) {
          console.log(error.message);
        } else {
          if (user !== null) {
          	console.log(user.approved);
            if (user.isPasswordMatching(password) && user.approved===true) {
              req.session.user = user;
              res.redirect("/");
            } else {
              res.redirect("/login?error=password-invalid");
            }
          } else {
            res.redirect("/login?error=user-not-existing");
          }
        }
      });
    } else {
      res.render(
        "static/login", {
          metaData: req.metaData
        }
      );
    }

  } catch (error) {
    // Redirect with error
    res.redirect("/login?error=" + error.message);
  }
};