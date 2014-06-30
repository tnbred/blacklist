var models = require(__dirname + "/../models");
var validation = require( __dirname + '/validations/registrationValidation')




module.exports = function(req, res) {
  var usererror = validation.checkPostedParameters( req , function( user , error ){
    if( error ){
      validation.redirectRegistration( res , req , user , error );
    }
    else{
      if( user ){
        user.saltPassword(function(error) {
          user.save().then(function(user) {
            validation.redirectRegistration( res , req , user , error );
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






