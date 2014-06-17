var models = require(__dirname + "/../../models");
var validation = require(__dirname + '/../validations/updateProfileValidation')

module.exports = function(req, res) {

  var user = req.param("user", null)
  var User = models.User
  var new_user = new User({
    id: req.metaData.current_user.id
  })
  new_user.fetch().then(function(current_user) {
    try {
      validation.checkPostedInfo(current_user, user);
      message = validation.updatePostedInfo(current_user, user, req, res);

      if (user.password) {
        current_user.saltPassword(function(error) {
          finish(current_user , new_user , message , req , res);
        }); 
      }
      else {
        finish( current_user , new_user , message  , req , res);
      }

    } catch (error) {
      res.render("user/profile", {
        message: [{
          alertType: "alert-danger",
          strongMessage: "Error!",
          messageText: error,
          display: true
        }, {
          alertType: 'alert-success',
          strongMessage: 'info2',
          messageText: 'info3',
          display: true

        }],
        metaData: req.metaData
      });
    }

  });
};

function finish( current_user , new_user , message , req , res) {
  current_user.save();
  req.session.user = current_user;
  new_user.fetch().then(function(current_user) {
    res.render("user/profile", {
      message : message , 
      metaData : req.metaData,
    });
  });
}