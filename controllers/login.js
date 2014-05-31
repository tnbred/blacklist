var models = require(__dirname + "/../models");

module.exports = function(req, res) {
  try {
    // Try login
    var email = req.param("email", null);
    var password = req.param("password", null);

    if (email && password) {

      models.User.findByEmail(email, function(error, user) {
      	try {
        	if(error!==null) throw error.message;
            if(user===null) throw "user-doesnt-exists";
          	if(!user.isPasswordMatching(password)) throw "password-invalid";
          	if(user.approved!==true) throw "User hasn't been approved yet.";
              req.session.user = user;
              res.redirect("/");
        } catch(error) {
        	console.log(error);
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