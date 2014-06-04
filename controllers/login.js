var models = require(__dirname + "/../models");

module.exports = function(req, res) {
  try {
    // Try login
    var email = req.param("email", null);
    var password = req.param("password", null);

    if (email && password) {
      new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
      try {
        if(user===null) throw "user-doesnt-exists";
        if(!user.isPasswordMatching(password)) throw "password-invalid";
        if(user.get("approved")!==true) throw "User hasn't been approved yet.";
          req.session.user = user;
          res.redirect("/");
        } catch(error) {
          res.redirect("/login?error=" + error);
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