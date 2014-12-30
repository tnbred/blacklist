var models = require(__dirname + "/../../models");
var validation = require(__dirname + '/../../validations/checkTutoInfo')

module.exports = function(req, res) {
  var nickname = req.param("nickname", null)
  var User     = models.User
  var new_user = new User({
    id: req.metaData.current_user.id
  })
  new_user.fetch().then(function(current_user) {
    try {
      message = validation.checkNicknameTuto( current_user , nickname ); //check validity of posted info
      if( message ){
        req.metaData.current_user.nickname = nickname;
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
      res.render("user/home", {
        message : message , 
        metaData : req.metaData,
      });   
  }
}
