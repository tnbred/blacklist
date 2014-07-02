var models = require(__dirname + "/../models");
var validation = require(__dirname + '/../validations')



module.exports = function(req, res) {
  var registrationValidation = validation.registrationValidation
  var email = req.param("email", null)
  var password = req.param("password", null)
  var password_confirmation = req.param("password_confirmation", null)
  var params = {}
  params.email = email
  params.password = password
  params.password_confirmation = password_confirmation

  if (email && password && password_confirmation) {
    var callback = function(error, user, message) {
      if (error) {
        res.render("static/home", {
          message: message,
          metaData: req.metaData,
          user: user
        });
      } else {
        if (user) {
          user.saltPassword(function(error) {
            user.save().then(function(user) {
              res.render("static/login", {
                message: message,
                metaData: req.metaData,
                user: user
              });
            });
          })
        }
      }
      //check posted params and return a user ( null in case of error ) and an error

    }

    registrationValidation.checkPostedParameters(params, callback);

  } else {
    if (req.metaData.current_user) {
      res.redirect("/user/home");
    } else {
      res.render(
        "static/home", {
          metaData: req.metaData
        });
    }
  }


}