var models = require(__dirname + "/../models");
var validation = require(__dirname + '/../validations')

module.exports = function(req, res) {
  try {
    // Try login
    var saltToken = req.param("token", null);
    var sentUser = req.param("user", null);
    var resetPasswordValidation = validation.resetPasswordValidation;
    if (saltToken) {
      if (sentUser) {

        try{
          resetPasswordValidation.checkPostedParameters( sentUser );
          new models.User().query('where', 'salt', '=', saltToken).fetch().then(function(user) {
            var newPassword = sentUser["password"];
            user.set("password", newPassword);
            user.saltPassword(function(error) {
              user.save().then(function(user) {
                if (error) {
                  res.redirect("/?error=" + error);
                } else {
                  req.login(user, function(err) {
                    if (err) {
                      return next(err);
                    }

                    message = [{
                      alertType: "alert-success",
                      strongMessage: "Your password was successfully updated!",
                      messageText: "",
                      display: true
                    }]
                    req.metaData.tokenn = saltToken;

                    res.render(
                      "user/home", {
                        metaData: req.metaData,
                        message: message
                      });

                  });
                }
              })
            })
          })  
        }
        catch (error) {
          message= [{
            alertType: "alert-danger",
            strongMessage: "Error!",
            messageText: error,
            display: true
          }]
          res.render(
            "static/password", {
              metaData: req.metaData,
              message: message,
              salt: saltToken
            });

        }  
      }
      else {
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
            req.metaData.tokenn = saltToken;
            message= [{
            alertType: "alert-danger",
            strongMessage: "Error!",
            messageText: error,
            display: true
          }]
          res.render(
            "static/password", {
              metaData: req.metaData,
              message: message,
            });
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