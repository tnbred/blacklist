/*
function checkLoginInfo ( user , password ){
  if (user === null) throw "user-doesnt-exists";
  if (!user.isPasswordMatching(password)) throw "password-invalid";
  if (user.get("approved") !== true) throw "User hasn't been approved yet.";
}
exports.checkLoginInfo = checkLoginInfo ;
*/
var models = require(__dirname + "/../../models");

function redirectLoginError( res , error , metaData ){
  if( error ){
    res.render("static/login", {
      message: {
        messageErrorSuccess: {
          alertType: "alert-danger",
          strongMessage: "Login Error!",
          messageText: error,
          display: true
        },
        messageInfo: {
          alertType: "alert-success",
          strongMessage: "Login Error!",
          messageText: error,
          display: true
        }
      },
      metaData: metaData
    });  
  }
  else{
    res.render(
      "static/login", {
        metaData: metaData
      }
      );
  }
}

function checkLoginInfo ( req , res ){
  var email = req.param("email", null);
  var password = req.param("password", null);

  if (email && password) {
    new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
      try {
        if (user === null) throw "user doesn't exist";
        if (!user.isPasswordMatching(password)) throw "Password invalid";
        if (user.get("approved") !== true) throw "User hasn't been approved yet.";
        req.session.user = user;
        res.redirect("/");
      } catch (error) {
         redirectLoginError( res , error , req.metaData)
      }
    });
  } else {
      redirectLoginError( res , error = false , req.metaData)
  }
}

exports.checkLoginInfo = checkLoginInfo ;