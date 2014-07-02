var models = require(__dirname + "/../../models");
var validation = require(__dirname + '/../../validations/updateProfileValidation')

module.exports = function(req, res) {

  var user = req.param("user", null)
  var User = models.User
  var new_user = new User({
    id: req.metaData.current_user.id
  })
  new_user.fetch().then(function(current_user) {

    try {
      validation.checkPostedInfo( current_user , user ); //check validity of posted info
      message = validation.updatePostedInfo( current_user , user ); //create action message
      if( user.password ){
        current_user.saltPassword(function(error) {
          finish(current_user ,  message );
        }); 
      }
      else {
        finish( current_user ,  message  );
      }

    } catch (error) {
      res.render("user/profile", {
        message: [{
          alertType: "alert-danger",
          strongMessage: "Error!",
          messageText: error,
          display: true
        }],
        metaData: req.metaData
      });
    }

  });
  function finish(current_user , message ) {
    current_user.save()
    req.login(current_user, function(err) {
      if (err) {
        return next(err);
      }

      if( user.nickname ) req.metaData.current_user.nickname = user.nickname;
      if( user.email ) req.metaData.current_user.email = user.email;
      res.render("user/profile", {
        message : message , 
        metaData : req.metaData,
      });   
    });
  }

};

