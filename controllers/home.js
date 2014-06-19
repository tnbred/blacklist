var models = require(__dirname + "/../models");
var validation = require( __dirname + '/validations/registrationValidation')




module.exports = function(req, res) {
  var usererror = validation.checkPostedParameters( req , function( user , error ){
    if( error ){
      validation.redirectRegistration( res , req , error );
    }
    else{
      if( user ){
        user.saltPassword(function(error) {
          user.save().then(function(user) {
            validation.redirectRegistration( res , req , error );
          });
        })
      }
      else {
        if(req.metaData.current_user){
          res.redirect("/user/home");
        }
        else{
        res.render(
          "static/home", {
            metaData: req.metaData
          });          
        }

      }
    }
//check posted params and return a user ( null in case of error ) and an error

});
}










/*
var models = require(__dirname + "/../models");



module.exports = function(req, res) {
  try {

    // Try login
    var email = req.param("email", null);
    var password = req.param("password", null);
    var password_confirmation = req.param("password_confirmation", null);

    if (email && password && password_confirmation) {

      if (password !== password_confirmation) throw "Password doesn't match password confirmation";
      var User = models.User;
      var user = new User({
        email: email,
        approved: false,
        password: password
      });
      user.saltPassword(function(error) {

        user.save().then(function(user) {
          if (error) {
            res.render("static/home", {
              message: [],
              metaData: req.metaData
            });

          } else {
            res.render("static/login", {
              message: [],
              metaData: req.metaData
            });
          }
        });
    });
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
} catch (error) {
    // Redirect with error
    res.redirect("/?error=" + error.message);
  }
};


*/