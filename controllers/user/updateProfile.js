var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
	
      var user = req.param("user",null);

      console.log(user);

      models.User.find({'_id': req.session.user._id}, function(error, current_users) {
      	try {

      	var current_user=current_users[0];

      	if(error) throw error;
      	if(user.current_password===null) throw "No password provided";
        if(!current_user.isPasswordMatching(user.current_password)) throw "password-invalid";
        if(user.password){
      	  if(user.password!==user.password_confirmation) throw "password confirmation doesn't match password";
        }
        if(user.nickname) current_user.nickName=user.nickname;
        if(user.email) current_user.email=user.email;
        if(user.password) {
        	current_user.password=user.password;
            current_user.saltPassword(function(error) {
              finish(current_user);
            });
        } else {
        	finish(current_user);
        }

        } catch(error) {
  	      res.redirect("/user/profile?error="+error);
        }

      });

	function finish(current_user){
      	current_user.save();
        req.session.user=current_user;
        res.redirect("/user/profile?success=1");
      }
};