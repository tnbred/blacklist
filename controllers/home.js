var models = require(__dirname + "/../models");

module.exports = function(req, res) {
  try {
    // Try login
    var email = req.param("email", null);
    var password = req.param("password", null);

    if (email && password) {
      var User = models.User;
      var user = new User({
        email: email,
        approved: false,
        password: password
      });

      user.saltPassword(function(error) {
        // Save to mongo
        user.save(function(error) {
          if (error) {
            res.redirect("/?error=" + error.message);
          } else {
            res.redirect("/?success=sign-up-successfull");
          }
        });
      });
    } else {
        res.render(
		"static/home", {
			metaData: req.metaData
		}
	);
    }

  } catch (error) {
    // Redirect with error
    res.redirect("/?error=" + error.message);
  }
};