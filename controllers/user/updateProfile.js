var models = require(__dirname + "/../../models");

module.exports = function(req, res) {

  var user = req.param("user", null)
  var User = models.User
  var new_user = new User({
    id: req.metaData.current_user.id
  })

  new_user.fetch().then(function(current_user) {
    try {
      if (user.current_password === null) throw "No password provided";
      if (!current_user.isPasswordMatching(user.current_password)) throw "password-invalid";
      if (user.password) {
        if (user.password !== user.password_confirmation) throw "password confirmation doesn't match password";
      }
      if (user.nickname) current_user.set("nickname", user.nickname);
      if (user.email) current_user.set("email", user.email);
      if (user.password) {
        current_user.set("password", user.password);
        current_user.saltPassword(function(error) {
          finish(current_user);
        });
      } else {
        finish(current_user);
      }

    } catch (error) {
      res.redirect("/user/profile?error=" + error);
    }

  });

  function finish(current_user) {
    current_user.save()
    req.login(current_user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/user/profile?success=1");
    });
  }
};